from google.cloud import bigquery
import pandas as pd
from typing import Optional

class BigQueryManager:
    def __init__(self, project_id: str, dataset_id: str = "purestudio_4"):
        self.client = bigquery.Client(project=project_id)
        self.dataset_id = dataset_id
        self._ensure_dataset()

    def _ensure_dataset(self):
        dataset_ref = self.client.dataset(self.dataset_id)
        try:
            self.client.get_dataset(dataset_ref)
        except Exception:
            dataset = bigquery.Dataset(dataset_ref)
            dataset.location = "US"
            self.client.create_dataset(dataset, timeout=30)

    def ingest_students(self, dataframe: pd.DataFrame):
        """
        Ingesta masiva de alumnos (RUT, Grado, Institución).
        """
        table_id = f"{self.client.project}.{self.dataset_id}.students"
        job_config = bigquery.LoadJobConfig(
            write_disposition="WRITE_TRUNCATE", # Assuming fresh load for mass ingestion
        )
        job = self.client.load_table_from_dataframe(dataframe, table_id, job_config=job_config)
        job.result()

    def get_student_profile(self, rut: str) -> Optional[dict]:
        query = f"""
        SELECT * FROM `{self.client.project}.{self.dataset_id}.students`
        WHERE rut = @rut
        LIMIT 1
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("rut", "STRING", rut)
            ]
        )
        query_job = self.client.query(query, job_config=job_config)
        results = list(query_job.result())
        if results:
            return dict(results[0])
        return None

    def save_interaction(self, rut: str, activity: str, result: str, feedback: str):
        """
        Guarda la interacción para mantener continuidad pedagógica.
        """
        table_id = f"{self.client.project}.{self.dataset_id}.interactions"
        rows_to_insert = [
            {
                "rut": rut,
                "timestamp": bigquery.dbapi.datetime.datetime.now().isoformat(),
                "activity": activity,
                "result": result,
                "feedback": feedback
            }
        ]
        self.client.insert_rows_json(table_id, rows_to_insert)

    def get_pedagogical_history(self, rut: str, limit: int = 5):
        query = f"""
        SELECT activity, result, feedback, timestamp 
        FROM `{self.client.project}.{self.dataset_id}.interactions`
        WHERE rut = @rut
        ORDER BY timestamp DESC
        LIMIT @limit
        """
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("rut", "STRING", rut),
                bigquery.ScalarQueryParameter("limit", "INTEGER", limit)
            ]
        )
        query_job = self.client.query(query, job_config=job_config)
        return [dict(row) for row in query_job.result()]
