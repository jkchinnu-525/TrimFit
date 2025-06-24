import requests

def test_upload():
    url = "http://localhost:8000/api/v1/document/upload"
    
    # Replace with path to your test DOCX file
    with open("test_resume.docx", "rb") as f:
        files = {"file": ("test_resume.docx", f, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
        response = requests.post(url, files=files)
    
    print("Status:", response.status_code)
    print("Response:", response.json())

if __name__ == "__main__":
    test_upload() 