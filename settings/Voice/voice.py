import os
import playsound
import pyperclip
import speech_recognition as sr
from gtts import gTTS

# criar um objeto de reconhecimento
r = sr.Recognizer()

# capturar áudio do microfone
with sr.Microphone() as source:
    print("Fale algo: ")
    audio = r.listen(source)
    
    # usar o reconhecimento de voz do Google para transcrever o áudio
    try:
        text = r.recognize_google(audio, language='pt-BR')
        print("Transcrição: " + text)
        
        if "navegador" in text:
            os.system("start Chrome.exe")
            
        elif "salvar" in text:
            with open("arquivo.txt", "w") as file:
                file.write(text)
            print("Arquivo salvo como arquivo.txt")
            
        elif "salvar_como" in text:
            with open("arquivo_exemplo.txt", "w") as file:
                print("Arquivo salvo como arquivo_ex.txt")
            
        elif "cortar" in text:
            pyperclip.copy(text)
            print("Texto cortado para a area de transferencia")
            
        elif "copiar" in text:
            pyperclip.copy(text)
            print("Texto copiado para area de transferencia")
            
        elif "colar" in text:
            colado = pyperclip.paste()
            print("Texto colado:  " + colado)
            
        else:
            print("Comando não reconhecido")

        # gera a voz a partir do texto reconhecido
        tts = gTTS(text=text, lang='pt-br')
        tts.save('audio.mp3')

        # reproduzir o áudio gerado
        playsound.playsound('audio.mp3')

    except sr.UnknownValueError:
        print("Não foi possível entender o áudio")
        
    except sr.RequestError as e:
        print("Erro ao solicitar resultados do serviço de reconhecimento de voz do Google; {0}".format(e))
