from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptInput(BaseModel):
    mood: str
    style: str
    location: str
    time: str
    elements: str

class ImageRequest(BaseModel):
    prompt: str

@app.post("/refine-prompt")
async def refine_prompt(input: PromptInput):
    try:
        system_prompt = "You are a prompt engineer. Turn user settings into vivid, image-generation prompts."
        user_prompt = (
            f"Create a highly detailed visual description for an image based on the following:\n"
            f"Mood: {input.mood}\n"
            f"Style: {input.style}\n"
            f"Location: {input.location}\n"
            f"Time: {input.time}\n"
            f"Elements: {input.elements}"
        )

        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.9
        )
        refined = response['choices'][0]['message']['content']
        return {"refined_prompt": refined}
    except Exception as e:
        print("Error in refine_prompt:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-image")
async def generate_image(req: ImageRequest):
    try:
        response = openai.Image.create(
            model="dall-e-3",
            prompt=req.prompt,
            n=1,
            size="1024x1024"
        )
        image_url = response['data'][0]['url']
        return {"image_url": image_url}
    except Exception as e:
        print("Error in generate_image:", e)
        raise HTTPException(status_code=500, detail=str(e))
