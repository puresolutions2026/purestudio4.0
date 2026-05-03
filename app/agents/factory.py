import vertexai
from vertexai.generative_models import GenerativeModel, SafetySetting, GenerationConfig
from app.agents.prompts import (
    TUTOR_A_PROMPT, TUTOR_B_PROMPT, TUTOR_C_PROMPT, TUTOR_D_PROMPT,
    LANGUAGE_PROMPTS, PAES_PROMPT
)

class AgentFactory:
    def __init__(self, project_id: str, location: str = "us-central1"):
        vertexai.init(project=project_id, location=location)
        self.model_name = "gemini-1.5-pro" # Targeting best available
        
        # Configuration as per user requirements
        self.generation_config = GenerationConfig(
            temperature=0.15,  # Midpoint of 0.1 - 0.2
            top_p=0.95,
            max_output_tokens=2048,
        )
        
        # Safety Settings: Block None for technical/educational, but child protection active
        # Note: In Vertex AI, "BLOCK_NONE" is available but should be used responsibly.
        self.safety_settings = [
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold=SafetySetting.HarmBlockThreshold.BLOCK_ONLY_HIGH
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold=SafetySetting.HarmBlockThreshold.BLOCK_ONLY_HIGH
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold=SafetySetting.HarmBlockThreshold.BLOCK_ONLY_HIGH
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=SafetySetting.HarmBlockThreshold.BLOCK_ONLY_HIGH
            ),
        ]

    def get_tutor(self, grade_level: int):
        if 1 <= grade_level <= 3:
            prompt = TUTOR_A_PROMPT
        elif 4 <= grade_level <= 6:
            prompt = TUTOR_B_PROMPT
        elif 7 <= grade_level <= 7 or grade_level == 8 or grade_level == 9: # 7° to 1° Medio (9)
            prompt = TUTOR_C_PROMPT
        else: # 2° to 4° Medio (10-12)
            prompt = TUTOR_D_PROMPT
        
        return GenerativeModel(
            model_name=self.model_name,
            system_instruction=prompt,
        )

    def get_language_tutor(self, lang_code: str):
        prompt = LANGUAGE_PROMPTS.get(lang_code, LANGUAGE_PROMPTS["en"])
        return GenerativeModel(
            model_name=self.model_name,
            system_instruction=prompt,
        )

    def get_paes_specialist(self):
        return GenerativeModel(
            model_name=self.model_name,
            system_instruction=PAES_PROMPT,
        )
