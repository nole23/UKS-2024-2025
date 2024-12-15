# Podesi osnovnu sliku
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Set radni direktorijum
WORKDIR /app

# Kopiraj requirements.txt i instaliraj zavisnosti
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Kopiraj ostatak aplikacije
COPY . /app/

# Pokreni migracije i kreiranje modela
CMD ["bash", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
