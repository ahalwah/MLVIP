#include <SoftwareSerial.h>
#include <Servo.h>

Servo servo1;
Servo servo2;
//UART TO HM10 Module
const int bluRX_ardTXpin = 13;
const int bluTX_ardRXpin = 12;
String angle1="";
String angle2="";
boolean storea1 = false;
boolean storea2 = false;
SoftwareSerial bluetooth(bluTX_ardRXpin, bluRX_ardTXpin);
void setup() {
  servo1.attach(9);
  servo1.write(0);
  servo2.attach(10);
  servo2.write(0);
  bluetooth.begin(9600);
  Serial.begin(9600);
}

void loop() {
  if(bluetooth.available()>0){
    char c = bluetooth.read();
    if(c=='!'){
      //write angles
      //handle NAN values
      storea2=false;
      if(angle1.toInt() >=0 && angle1.toInt() <=180 && angle2.toInt() >=0 && angle2.toInt() <=180){
        Serial.print(angle1);
        Serial.print(' ');
        Serial.println(angle2);
        servo1.write(angle1.toInt());
        delay(100);
        servo2.write(angle2.toInt());
        delay(100);
      }
      angle1="";
      angle2="";
    }
    if(storea1 && c!='#'){
      angle1.concat(c);
      //Serial.println(angle1);
    }
    if(c=='@') storea1=true;
    if(storea2){
      angle2.concat(c);
      //Serial.println(c);
    }
    if(c=='#') {
      storea2 = true;
      storea1=false;
    }
  }
}
