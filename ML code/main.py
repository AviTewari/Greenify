from flask import Flask, render_template, request, redirect
from werkzeug.utils import secure_filename
import os
from shutil import copyfile

import numpy as np
from keras.preprocessing import image

from keras.models import load_model
import sys
from PIL import Image
sys.modules['Image'] = Image 
import tensorflow as tf
tf.__version__

app = Flask(__name__)
app.config["ALLOWED_IMAGE_EXTENSION"]=["PNG","JPG","JPEG"]
pathmodel = r"static/Trained_Model/Leaf_Detection.h5"
cnn = load_model( pathmodel )


APP_ROOT= os.path.dirname(os.path.abspath(__file__))
target = os.path.join(APP_ROOT,'static/')
app.config["DEBUG"] = True

picFolder = os.path.join('static','content')
#os.path.isfile('mydirectory/myfile.txt')  ---> to  check whether file existe or not
app.config["UPLOAD_FOLDER"] = picFolder

pic1 = os.path.join(app.config['UPLOAD_FOLDER'],'abc.jpg')


@app.route('/')
def flash():
    return render_template("flash.html")
    
@app.route('/index')
def index():
    return render_template("index.html")

@app.route('/weather')
def weather():
    return render_template("weather.html")

@app.route('/chatbot')
def chatbot():
    return render_template("chatbot.html")

@app.route('/team')
def team():
    return render_template("team.html")

@app.route('/upload',methods=["GET","POST"])
def upload():
    if request.method == "POST":
        file=request.files['uploadBills']
        #file.save(secure_filename(file.filename))
        #file.save(os.path.join("static/pics", file.filename))
        file.filename = "abc.jpg"  #some custom file name that you want
        file.save("static/content/"+file.filename)
        src = r"static/content/abc.jpg"
        dst = r"static/copied_img/abc.jpg"
        copyfile(src, dst)
    return render_template("upload.html")   

@app.route('/result')
def result():
    pathimg=r"static/content/abc.jpg"
    test_image = image.load_img(pathimg, target_size = (64, 64))
    test_image = image.img_to_array(test_image)
    test_image = np.expand_dims(test_image, axis = 0)
    result = cnn.predict(test_image)
    if result[0][0] == 1:
        prediction = 'Hurray! Your CROP is HEALTHY'
    else:
        prediction = 'Uff! Your CROP is INFECTED'
    print(prediction)
    return render_template("result.html", pred = prediction)

if __name__ == "__main__":
    app.run()