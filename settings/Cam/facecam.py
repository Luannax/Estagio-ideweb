import cv2  # OpenCV
import mediapipe as mp  # MediaPipe
import os  # Biblioteca para obter o nome do usuário
import pyttsx3  # Biblioteca para síntese de fala
import time  # Biblioteca para controlar tempo de execução
import threading  # Biblioteca para utilizar threads

# Inicializando o sintetizador de voz
engine = pyttsx3.init()

# Função para falar instruções (usando thread)
def falar(texto):
    def run():
        engine.say(texto)
        engine.runAndWait()
    threading.Thread(target=run).start()

# Função para obter o nome completo do usuário
def get_full_username():
    if os.name == 'nt':  # Se for Windows
        import ctypes
        GetUserNameEx = ctypes.windll.secur32.GetUserNameExW
        NameDisplay = 3
        size = ctypes.pointer(ctypes.c_ulong(0))
        GetUserNameEx(NameDisplay, None, size)
        name_buffer = ctypes.create_unicode_buffer(size.contents.value)
        GetUserNameEx(NameDisplay, name_buffer, size)
        return name_buffer.value
    else:  # Se for Unix/Linux/Mac
        import pwd
        return pwd.getpwuid(os.getuid())[4]

# Inicializando o OpenCV e o MediaPipe
webcam = cv2.VideoCapture(0)  # Conecta o OpenCV à webcam do PC
so_rec_rost = mp.solutions.face_detection  # Usa a solução já pronta no MediaPipe de reconhecimento de rosto
rec_rost = so_rec_rost.FaceDetection()  # Elemento que será o reconhecedor (processar a imagem)
desen = mp.solutions.drawing_utils

# Obtendo o nome completo do usuário
nome_usuario = get_full_username()

# Variável para controlar a frequência das instruções
contador_frames = 0

while True:
    # Ler as informações da webcam
    verifi, frame = webcam.read()  # Se ele conseguir ler a informação da webcam, joga a imagem que capturou

    if not verifi:
        break

    h, w, _ = frame.shape

    # Coordenadas do retângulo central (quadrado)
    rect_size = 200  
    x1 = (w - rect_size) // 2
    y1 = (h - rect_size) // 2
    x2 = x1 + rect_size
    y2 = y1 + rect_size

    # Desenha o retângulo central
    cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)

    # Reconhece o rosto que está na imagem
    lista_rost = rec_rost.process(frame)

    # Se tiver um ou mais rostos
    if lista_rost.detections:
        for rost in lista_rost.detections:
            # Desenha o rosto na imagem
            desen.draw_detection(frame, rost)
            
            # Verifica se o rosto está dentro do retângulo central
            bboxC = rost.location_data.relative_bounding_box
            x_min = int(bboxC.xmin * w)
            y_min = int(bboxC.ymin * h)
            x_max = int((bboxC.xmin + bboxC.width) * w)
            y_max = int((bboxC.ymin + bboxC.height) * h)

            # Limitar instruções de voz a cada 10 frames
            if contador_frames % 10 == 0:
                # Direciona o usuário a centralizar o rosto
                if x_min < x1:
                    falar("Vire seu rosto para a direita.")
                elif x_max > x2:
                    falar("Vire seu rosto para a esquerda.")
                elif y_min < y1:
                    falar("Levante seu rosto.")
                elif y_max > y2:
                    falar("Abaixe seu rosto.")
                else:
                    falar("Rosto centralizado.")
    
    # Aumenta o contador de frames
    contador_frames += 1

    # Exibe o nome completo do usuário na imagem
    cv2.putText(frame, f"Usuario: {nome_usuario}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

    # Mostrar a imagem com o rosto detectado, nome do usuário, e instruções de centralização
    cv2.imshow("Rosto Webcam", frame)

    # Pausa de 50ms para reduzir o uso de CPU e permitir controle sobre o FPS
    if cv2.waitKey(50) & 0xFF == 27:  # Espera 50ms e verifica se a tecla Esc foi pressionada (27 é Esc)
        break

# Desativar a webcam e fechar a janela
webcam.release()
cv2.destroyAllWindows()

