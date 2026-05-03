# PureCheck Solutions Infrastructure Setup Script
# This script uses the Google Cloud SDK commands to configure the PureStudio 4.0 infrastructure.

$PROJECT_ID = "purecheck-solutions"
$REGION = "us-central1"

echo "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

echo "Enabling critical APIs..."
gcloud services enable aiplatform.googleapis.com discoveryengine.googleapis.com bigquery.googleapis.com

echo "Creating buckets..."
# Bucket 1: Assets Vault
gsutil mb -c Standard -l $REGION -b on gs://purestudio-assets-vault
# Bucket 2: Users Data
gsutil mb -c Standard -l $REGION -b on gs://purestudio-users-data

echo "Creating folder structure in gs://purestudio-assets-vault..."
# Note: Folders in GCS are virtual, we create them by placing a placeholder or just using the path in future uploads.
# To "create" them via CLI, we can upload an empty file.
echo "" | gsutil cp - gs://purestudio-assets-vault/paes-oficial/.keep
echo "" | gsutil cp - gs://purestudio-assets-vault/idiomas/chino/.keep
echo "" | gsutil cp - gs://purestudio-assets-vault/idiomas/aleman/.keep
echo "" | gsutil cp - gs://purestudio-assets-vault/idiomas/ingles/.keep

echo "Configuring IAM permissions..."
$PROJECT_NUMBER = gcloud projects describe $PROJECT_ID --format="value(projectNumber)"
$SERVICE_ACCOUNT = "service-$PROJECT_NUMBER@gcp-sa-aiplatform.iam.gserviceaccount.com"

echo "Granting Storage Object Viewer to $SERVICE_ACCOUNT..."
gsutil iam ch "serviceAccount:$SERVICE_ACCOUNT:roles/storage.objectViewer" gs://purestudio-assets-vault
gsutil iam ch "serviceAccount:$SERVICE_ACCOUNT:roles/storage.objectViewer" gs://purestudio-users-data

echo "Infrastructure setup complete!"
