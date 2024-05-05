import cv2 #opencv (biblioteca para trabalhar com imagens)
import mediapipe as mp #Biblioteca do google, possuindo já algumas ferramentas de reconhecimento de imagem.


#Inicializando o open cv e o mediapipe
webcam = cv2.VideoCapture(0) #conecta o open cv a webcam do pc.
so_rec_rost = mp.solutions.face_detection #Usa a solução ja pronta no mediapipe de reconhecimento de rosto.
rec_rost = so_rec_rost.FaceDetection() #Elemento que será o reconhecedor (passar a imagem).
desen = mp.solutions.drawing_utils

while True:
    #Vai ler as informações da webcam.
    verifi, frame = webcam.read() #Se ele conseguir ler a informação da webcam, joga a imagem que capturou 

    if not verifi:
        break 
    
    #Reconhece o rosto que está ali.
    lista_rost = rec_rost.process(frame)

    #Se tiver mais de um rosto.
    if lista_rost.detections:
        for rost in lista_rost.detections:
             #Desenha esse rosto na imagem.
            desen.draw_detection(frame, rost)

    cv2.imshow("Rosto Webcam", frame)

    #Para quand aperta esc.
    if cv2.waitKey(5) == 27: #tempo de espera a apertar uma tecla no teclado (27 tecla esc)
        break


#Desativar a webcam.
webcam.release()
cv2.destroyAllWindows