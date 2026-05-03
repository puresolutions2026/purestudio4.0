import os
from google.cloud import storage
from google.api_core.exceptions import Conflict
from googleapiclient import discovery
from google.oauth2 import service_account

# Configuration
PROJECT_ID = "purecheck-solutions"
REGION = "US-CENTRAL1"
BUCKETS = [
    "purestudio-assets-vault",
    "purestudio-users-data"
]

def enable_apis():
    print("Enabling critical APIs...")
    service = discovery.build('serviceusage', 'v1')
    apis = [
        'aiplatform.googleapis.com',
        'discoveryengine.googleapis.com',
        'bigquery.googleapis.com'
    ]
    for api in apis:
        name = f"projects/{PROJECT_ID}/services/{api}"
        request = service.services().enable(name=name)
        try:
            request.execute()
            print(f"API {api} enabled.")
        except Exception as e:
            print(f"Error enabling {api}: {e}")

def create_buckets():
    storage_client = storage.Client(project=PROJECT_ID)
    for bucket_name in BUCKETS:
        bucket = storage_client.bucket(bucket_name)
        bucket.storage_class = "STANDARD"
        try:
            new_bucket = storage_client.create_bucket(bucket, location=REGION)
            new_bucket.iam_configuration.uniform_bucket_level_access_enabled = True
            new_bucket.patch()
            print(f"Bucket {new_bucket.name} created with UBLA enabled.")
        except Conflict:
            print(f"Bucket {bucket_name} already exists.")
        except Exception as e:
            print(f"Error creating bucket {bucket_name}: {e}")

def create_folders():
    storage_client = storage.Client(project=PROJECT_ID)
    bucket = storage_client.bucket("purestudio-assets-vault")
    folders = [
        "paes-oficial/",
        "idiomas/chino/",
        "idiomas/aleman/",
        "idiomas/ingles/"
    ]
    for folder in folders:
        blob = bucket.blob(folder)
        blob.upload_from_string('')
        print(f"Folder {folder} created.")

def setup_iam():
    print("Configuring IAM permissions...")
    from google.cloud import resourcemanager_v3
    
    rm_client = resourcemanager_v3.ProjectsClient()
    project_path = f"projects/{PROJECT_ID}"
    project = rm_client.get_project(name=project_path)
    project_number = project.name.split("/")[-1]
    
    # Vertex AI Service Agent usually follows this pattern
    service_account = f"service-{project_number}@gcp-sa-aiplatform.iam.gserviceaccount.com"
    print(f"Target Service Account: {service_account}")
    
    storage_client = storage.Client(project=PROJECT_ID)
    for bucket_name in BUCKETS:
        bucket = storage_client.bucket(bucket_name)
        policy = bucket.get_iam_policy(requested_policy_version=3)
        policy.bindings.append({
            "role": "roles/storage.objectViewer",
            "members": {f"serviceAccount:{service_account}"}
        })
        bucket.set_iam_policy(policy)
        print(f"Granted Storage Object Viewer to {service_account} on {bucket_name}.")

if __name__ == "__main__":
    # enable_apis() 
    create_buckets()
    create_folders()
    try:
        setup_iam()
    except Exception as e:
        print(f"Error setting IAM (likely permission related): {e}")
