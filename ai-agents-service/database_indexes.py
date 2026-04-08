"""
Database Index Management

Provides functions to create and monitor database indexes.
"""

from sqlalchemy import Index, inspect, text
from database import Base, db_manager
import logging

logger = logging.getLogger(__name__)


# Index definitions
INDEXES = {
    'simulations': [
        {'name': 'idx_sim_user_created', 'columns': ['user_id', 'created_at']},
        {'name': 'idx_sim_status_created', 'columns': ['status', 'created_at']},
        {'name': 'idx_sim_industry_status', 'columns': ['target_industry', 'status']},
    ],
    'simulation_results': [
        {'name': 'idx_results_conversion', 'columns': ['conversion_rate']},
        {'name': 'idx_results_churn', 'columns': ['churn_rate']},
    ],
    'api_logs': [
        {'name': 'idx_logs_time_endpoint', 'columns': ['created_at', 'endpoint']},
        {'name': 'idx_logs_status_time', 'columns': ['status_code', 'created_at']},
    ],
    'audit_logs': [
        {'name': 'idx_audit_action_time', 'columns': ['action', 'created_at']},
        {'name': 'idx_audit_user_time', 'columns': ['user_id', 'created_at']},
    ],
    'simulation_personas': [
        {'name': 'idx_personas_sim_id', 'columns': ['simulation_id']},
        {'name': 'idx_personas_pain_tech', 'columns': ['pain_level', 'tech_savviness']},
    ],
    'change_logs': [
        {'name': 'idx_changelog_sim_id', 'columns': ['simulation_id']},
        {'name': 'idx_changelog_author_time', 'columns': ['author_id', 'created_at']},
    ]
}


def create_indexes():
    """Create all defined indexes."""
    engine = db_manager.engine
    if not engine:
        logger.error("Database engine not initialized")
        return

    inspector = inspect(engine)

    for table_name, indexes in INDEXES.items():
        # Check if table exists
        if table_name not in inspector.get_table_names():
            logger.warning(f"Table {table_name} does not exist, skipping indexes")
            continue

        existing_indexes = {idx['name'] for idx in inspector.get_indexes(table_name)}

        for idx_config in indexes:
            idx_name = idx_config['name']

            if idx_name in existing_indexes:
                logger.debug(f"Index {idx_name} already exists")
                continue

            try:
                idx = Index(idx_name, *idx_config['columns'])
                idx.create(engine)
                logger.info(f"Created index: {idx_name} on {table_name}")
            except Exception as e:
                logger.error(f"Failed to create index {idx_name}: {e}")


def analyze_table(table_name: str):
    """Run ANALYZE on table to update statistics."""
    engine = db_manager.engine
    if not engine:
        return

    try:
        with engine.connect() as conn:
            conn.execute(text(f"ANALYZE {table_name}"))
            logger.info(f"Analyzed table: {table_name}")
    except Exception as e:
        logger.error(f"Failed to analyze table {table_name}: {e}")


def get_index_stats(table_name: str = None):
    """Get index statistics from PostgreSQL."""
    engine = db_manager.engine
    if not engine:
        return {}

    try:
        with engine.connect() as conn:
            if table_name:
                query = text("""
                    SELECT
                        schemaname,
                        tablename,
                        indexname,
                        indexdef
                    FROM pg_indexes
                    WHERE tablename = :table
                    ORDER BY indexname
                """)
                result = conn.execute(query, {'table': table_name})
            else:
                query = text("""
                    SELECT
                        schemaname,
                        tablename,
                        indexname,
                        indexdef
                    FROM pg_indexes
                    WHERE schemaname = 'public'
                    ORDER BY tablename, indexname
                """)
                result = conn.execute(query)

            indexes = {}
            for row in result:
                if row.tablename not in indexes:
                    indexes[row.tablename] = []
                indexes[row.tablename].append({
                    'name': row.indexname,
                    'definition': row.indexdef
                })

            return indexes
    except Exception as e:
        logger.error(f"Failed to get index stats: {e}")
        return {}


def get_query_stats():
    """Get query performance statistics from pg_stat_statements (if available)."""
    engine = db_manager.engine
    if not engine:
        return []

    try:
        with engine.connect() as conn:
            query = text("""
                SELECT
                    query,
                    calls,
                    total_time,
                    mean_time,
                    rows
                FROM pg_stat_statements
                WHERE dbid = (SELECT oid FROM pg_database WHERE datname = current_database())
                ORDER BY total_time DESC
                LIMIT 20
            """)
            result = conn.execute(query)

            return [
                {
                    'query': row.query[:100],
                    'calls': row.calls,
                    'total_time': row.total_time,
                    'mean_time': row.mean_time,
                    'rows': row.rows
                }
                for row in result
            ]
    except Exception as e:
        logger.warning(f"pg_stat_statements not available: {e}")
        return []


def get_table_sizes():
    """Get table and index sizes."""
    engine = db_manager.engine
    if not engine:
        return {}

    try:
        with engine.connect() as conn:
            query = text("""
                SELECT
                    schemaname,
                    tablename,
                    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as total_size,
                    pg_size_pretty(pg_relation_size(tablename::regclass)) as table_size,
                    pg_size_pretty(pg_indexes_size(tablename::regclass)) as index_size
                FROM pg_tables
                WHERE schemaname = 'public'
                ORDER BY pg_total_relation_size(tablename::regclass) DESC
            """)
            result = conn.execute(query)

            return {
                row.tablename: {
                    'total': row.total_size,
                    'table': row.table_size,
                    'index': row.index_size
                }
                for row in result
            }
    except Exception as e:
        logger.error(f"Failed to get table sizes: {e}")
        return {}


class QueryOptimizer:
    """Query optimization utilities."""

    @staticmethod
    def explain(query, params=None):
        """Get query execution plan."""
        engine = db_manager.engine
        if not engine:
            return None

        try:
            with engine.connect() as conn:
                explain_query = text(f"EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) {query}")
                result = conn.execute(explain_query, params or {})
                return result.scalar()
        except Exception as e:
            logger.error(f"Failed to explain query: {e}")
            return None

    @staticmethod
    def suggest_indexes(query):
        """Suggest indexes based on query."""
        # This would require more sophisticated analysis
        # For now, return common patterns
        suggestions = []

        if 'WHERE' in query.upper():
            # Parse WHERE clause and suggest indexes
            pass

        return suggestions


def optimize_database():
    """Run database optimization tasks."""
    logger.info("Starting database optimization")

    # Create indexes
    create_indexes()

    # Analyze tables
    from database import User, Simulation, SimulationResult
    for table in ['users', 'simulations', 'simulation_results', 'simulation_timeline']:
        analyze_table(table)

    # Log stats
    sizes = get_table_sizes()
    logger.info(f"Table sizes: {sizes}")

    logger.info("Database optimization complete")


# CLI interface
if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Database index management')
    parser.add_argument('command', choices=['create', 'stats', 'sizes', 'optimize'])
    parser.add_argument('--table', help='Table name for specific operations')

    args = parser.parse_args()

    db_manager.init_engine()

    if args.command == 'create':
        create_indexes()
    elif args.command == 'stats':
        stats = get_index_stats(args.table)
        print(json.dumps(stats, indent=2))
    elif args.command == 'sizes':
        sizes = get_table_sizes()
        print(json.dumps(sizes, indent=2))
    elif args.command == 'optimize':
        optimize_database()
