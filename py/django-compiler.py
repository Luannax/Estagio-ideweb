from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import subprocess

@csrf_exempt  
def run_code(request):
    if request.method == 'POST':
        try:
            code = request.POST.get('code', '')
            language = request.POST.get('language', '')

            if language == 'python':
                result = run_python_code(code)
            else:
                result = "Language not supported for execution."

            return JsonResponse({'result': result})

        except Exception as e:
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Invalid request method'})

# função que executa o codigo py 
def run_python_code(code):
    try:
        result = subprocess.check_output(['python3', '-c', code], text=True, timeout=20)
        return result
    except subprocess.CalledProcessError as e:
        return f"Error: {e}"
