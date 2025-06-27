import os
import traceback
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import requests
import base64

load_dotenv()
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")
if not STABILITY_API_KEY:
    raise Exception("STABILITY_API_KEY environment variable not set")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-image")
async def generate_image(data: dict, request: Request):
    try:
        prompt_parts = [
            data.get("mood", "").strip(),
            data.get("style", "").strip(),
            data.get("location", "").strip(),
            data.get("time", "").strip(),
            data.get("elements", "").strip(),
        ]
        prompt = ", ".join(part for part in prompt_parts if part)
        if not prompt:
            return {"error": "Prompt data missing"}

        url = "https://api.stability.ai/v2beta/stable-image/generate/ultra"

        headers = {
            "Authorization": f"Bearer {STABILITY_API_KEY}",
            "Accept": "image/*",
           
        }

        

        files = {
            "none": ("none", "")  
        }
        data_form = {
            "prompt": prompt,
            "output_format": "webp",
           
        }

        response = requests.post(url, headers=headers, files=files, data=data_form)

        if response.status_code != 200:
            try:
                error_info = response.json()
            except Exception:
                error_info = response.text
            print(f"API returned error {response.status_code}: {error_info}")
            response.raise_for_status()

        # The response content is the binary image file
        base64_image = base64.b64encode(response.content).decode("utf-8")
        image_data_uri = f"data:image/webp;base64,{base64_image}"

        return {"image_url": image_data_uri}

    except Exception as e:
        tb = traceback.format_exc()
        print(f"Error during /generate-image: {e}\nTraceback:\n{tb}")
        return {"error": str(e), "traceback": tb}
