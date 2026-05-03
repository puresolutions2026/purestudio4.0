from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.agents.factory import AgentFactory
from app.data.bigquery import BigQueryManager
from app.agents.paes import PAESSpecialist
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PureStudio 4.0 Intelligence Engine")

# Configuration
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "purestudio-4")
bq_manager = BigQueryManager(PROJECT_ID)
agent_factory = AgentFactory(PROJECT_ID)
paes_specialist = PAESSpecialist(PROJECT_ID)

class QueryRequest(BaseModel):
    rut: str
    message: str
    lang_code: str = "es"

class IngestionRequest(BaseModel):
    data_url: str # Just an example, ideally it would be a file upload

@app.post("/tutor/ask")
async def ask_tutor(request: QueryRequest):
    # 1. Look up student profile for pedagogical continuity
    student = bq_manager.get_student_profile(request.rut)
    if not student:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    
    # 2. Get pedagogical history to maintain continuity
    history = bq_manager.get_pedagogical_history(request.rut)
    history_context = "\n".join([f"Actividad: {h['activity']}, Resultado: {h['result']}, Feedback previo: {h['feedback']}" for h in history])
    
    # 3. Select appropriate agent based on grade
    grade = student.get("grado", 1)
    agent = agent_factory.get_tutor(grade)
    
    # 4. Generate response with context
    full_prompt = f"Contexto pedagógico del alumno:\n{history_context}\n\nPregunta actual: {request.message}"
    response = agent.generate_content(full_prompt)
    
    # 5. Save interaction for tomorrow's continuity
    bq_manager.save_interaction(
        rut=request.rut,
        activity="Consulta General",
        result="Respondida",
        feedback=response.text[:200]
    )
    
    return {"response": response.text}

@app.post("/language/ask")
async def ask_language_tutor(request: QueryRequest):
    # Specialized language tutor
    agent = agent_factory.get_language_tutor(request.lang_code)
    response = agent.generate_content(request.message)
    return {"response": response.text}

@app.post("/paes/simulate")
async def start_paes_sim(rut: str, subject: str):
    return paes_specialist.start_simulation(rut, subject)

@app.post("/data/ingest")
async def ingest_data(request: IngestionRequest):
    # This would involve reading the source and calling bq_manager.ingest_students
    return {"status": "Pipeline de ingesta masiva iniciado"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
