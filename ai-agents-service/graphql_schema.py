"""
GraphQL Schema Definition

Provides GraphQL API alongside REST for flexible querying.
"""

try:
    from graphene import ObjectType, String, Int, Float, List, Field, Schema, Mutation, Argument
    from graphene_sqlalchemy import SQLAlchemyObjectType
    import graphene
    GRAPHQL_AVAILABLE = True
except ImportError:
    GRAPHQL_AVAILABLE = False
    print("Warning: Graphene not installed. GraphQL API unavailable.")

if GRAPHQL_AVAILABLE:
    from database import Simulation as SimulationModel, SimulationResult as ResultModel

    class Simulation(SQLAlchemyObjectType):
        """Simulation GraphQL type."""
        class Meta:
            model = SimulationModel
            exclude_fields = ('user_id',)

        result = Field(lambda: SimulationResult)
        timeline = List(lambda: TimelineDay)

        def resolve_result(self, info):
            return self.result

        def resolve_timeline(self, info):
            return self.timeline

    class SimulationResult(SQLAlchemyObjectType):
        """Simulation result GraphQL type."""
        class Meta:
            model = ResultModel

    class TimelineDay(ObjectType):
        """Timeline day type."""
        day = Int()
        new_users = Int()
        active_users = Int()
        revenue = Float()
        satisfaction = Float()

    class Query(ObjectType):
        """GraphQL query definitions."""
        simulations = List(
            Simulation,
            status=String(),
            industry=String(),
            limit=Int(default_value=20),
            offset=Int(default_value=0)
        )
        simulation = Field(Simulation, id=String(required=True))
        simulation_stats = Field(lambda: SimulationStats)

        def resolve_simulations(self, info, status=None, industry=None, limit=20, offset=0):
            """Query simulations with filters."""
            from database import db_manager
            from sqlalchemy.orm import joinedload

            user = info.context.get('user')
            if not user:
                return []

            session = db_manager.get_session()
            try:
                query = session.query(SimulationModel).options(
                    joinedload(SimulationModel.result)
                )

                if not user.get('role') == 'admin':
                    query = query.filter(SimulationModel.user_id == user.get('sub'))

                if status:
                    query = query.filter(SimulationModel.status == status)
                if industry:
                    query = query.filter(SimulationModel.target_industry == industry)

                return query.offset(offset).limit(limit).all()
            finally:
                session.close()

        def resolve_simulation(self, info, id):
            """Get single simulation."""
            from database import db_manager
            from sqlalchemy.orm import joinedload

            user = info.context.get('user')
            if not user:
                return None

            session = db_manager.get_session()
            try:
                query = session.query(SimulationModel).options(
                    joinedload(SimulationModel.result),
                    joinedload(SimulationModel.timeline)
                ).filter(SimulationModel.id == id)

                if not user.get('role') == 'admin':
                    query = query.filter(SimulationModel.user_id == user.get('sub'))

                return query.first()
            finally:
                session.close()

        def resolve_simulation_stats(self, info):
            """Get simulation statistics."""
            from database import db_manager

            user = info.context.get('user')
            if not user:
                return None

            session = db_manager.get_session()
            try:
                query = session.query(SimulationModel)

                if not user.get('role') == 'admin':
                    query = query.filter(SimulationModel.user_id == user.get('sub'))

                total = query.count()

                by_status = session.query(
                    SimulationModel.status,
                    db_manager.Session().func.count(SimulationModel.id)
                ).group_by(SimulationModel.status).all()

                return SimulationStats(
                    total=total,
                    by_status={status: count for status, count in by_status}
                )
            finally:
                session.close()

    class SimulationStats(ObjectType):
        """Statistics type."""
        total = Int()
        by_status = graphene.JSONString()

    class CreateSimulation(Mutation):
        """Create simulation mutation."""
        class Arguments:
            name = String(required=True)
            feature_description = String()
            target_industry = String()
            persona_count = Int()
            simulation_days = Int()

        simulation = Field(lambda: Simulation)
        success = graphene.Boolean()

        def mutate(self, info, name, **kwargs):
            """Create new simulation."""
            import uuid
            from database import db_manager, create_simulation_db

            user = info.context.get('user')
            if not user:
                return CreateSimulation(success=False, simulation=None)

            sim_id = str(uuid.uuid4())[:8]
            config = {
                'name': name,
                'feature_description': kwargs.get('feature_description', ''),
                'target_industry': kwargs.get('target_industry', 'saas'),
                'persona_count': kwargs.get('persona_count', 1000),
                'simulation_days': kwargs.get('simulation_days', 90)
            }

            session = db_manager.get_session()
            try:
                sim = create_simulation_db(session, sim_id, user.get('sub'), config)
                session.commit()
                return CreateSimulation(success=True, simulation=sim)
            except Exception as e:
                session.rollback()
                return CreateSimulation(success=False, simulation=None)
            finally:
                session.close()

    class Mutation(ObjectType):
        """GraphQL mutations."""
        create_simulation = CreateSimulation.Field()

    # Create schema
    schema = Schema(query=Query, mutation=Mutation)

else:
    schema = None
