#start with clean python 3.12 environment 
FROM python:3.12-slim

#set working directory inside the container
WORKDIR /app 

#copy the requirements of the text file into the container 
COPY requirements.txt .

#install all project libraries inside the container 
RUN pip install --no-cache-dir -r requirements.txt 

#copy entire project folder (app.py, ml, database, etc.) into the container 
COPY . .

#Exposing the port so you can access it 
EXPOSE 8000

#The exact command to launch your FastAPI server automatically
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]