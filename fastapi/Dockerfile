# fastapi/Dockerfile
FROM python:3.9

WORKDIR /app

COPY fastapi/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY fastapi /app/

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
