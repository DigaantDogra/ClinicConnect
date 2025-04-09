import torch
import mlx.core as mx
from transformers import AutoTokenizer, AutoModelForCausalLM
from dotenv import load_dotenv
import os

load_dotenv()
model_path = os.getenv("MODEL_PATH")

import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import mlx.core as mx

import torch
from peft import PeftModel, PeftConfig
from transformers import AutoTokenizer, AutoModelForCausalLM

def load_model(model_path: str):
    print(f"Loading model from: {model_path}")
    
    # Verify essential files exist
    required_files = ['adapter_config.json', 'adapter_model.safetensors']
    for f in required_files:
        if not os.path.exists(os.path.join(model_path, f)):
            raise FileNotFoundError(f"Missing required file: {f}")

    # Device configuration
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"Using device: {device}")

    # Load base model
    base_model = AutoModelForCausalLM.from_pretrained(
        "mistralai/Mistral-7B-Instruct-v0.2",
        device_map=device,
        torch_dtype=torch.float16,
    )

    # Load trained adapter
    model = PeftModel.from_pretrained(
        base_model,
        model_path,
        device_map=device,
        is_trainable=False
    )
    
    # Merge for inference
    model = model.merge_and_unload()
    
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    tokenizer.pad_token = tokenizer.eos_token

    return model, tokenizer


def generate_plan(patient_profile, condition, subtype, comorbidities, 
                  tokenizer, model, max_length=512, temperature=0.7):
    
    prompt = f"""<s>[INST] Generate care plan for {condition} ({subtype}):
    Patient: {patient_profile}
    Comorbidities: {', '.join(comorbidities) or 'None'}
    [/INST]"""

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    with torch.backends.mps.profiler.profile(activities=[torch.profiler.ProfilerActivity.CPU]):
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_length,
            temperature=temperature,
            top_p=0.9,
            repetition_penalty=1.2,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )
    
    return tokenizer.decode(outputs[0], skip_special_tokens=True)