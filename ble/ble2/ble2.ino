#include <SoftwareSerial.h>
//Pins 
const int motorOne_InputTwo=4;
const int motorOne_InputOne=5;
const int motorOne_Enable=9;
const int motorTwo_Enable=10;
const int motorTwo_InputOne=6;
const int motorTwo_InputTwo=7;
int led = 2;

//UART TO HM10 Module
const int bluRX_ardTXpin = 13;
const int bluTX_ardRXpin = 12;
SoftwareSerial bluetooth(bluTX_ardRXpin, bluRX_ardTXpin);
void setup() {
  pinMode(led,OUTPUT);
  for(int i=4; i<=10; i++){
    if(i==8)
      continue;
  pinMode(i,OUTPUT);
  }
  //motor speeds
  analogWrite(motorOne_Enable, 125);
  analogWrite(motorTwo_Enable, 125);
  bluetooth.begin(9600);
  Serial.begin(9600);
}

void loop() {
  if(bluetooth.available()>0){
    //led indicator for bluetooth connected
    digitalWrite(led,HIGH);
    char c = bluetooth.read();
    Serial.println(sizeof(c));
    //Conditionals for different letter inputs
    if(c=='S'){
      Serial.println("Stop");
      digitalWrite(motorTwo_InputOne,LOW);
      digitalWrite(motorTwo_InputTwo,LOW);
      digitalWrite(motorOne_InputOne,LOW);
      digitalWrite(motorOne_InputTwo,LOW);
    }
    if(c=='R'){
      Serial.println("Turning Right");
      digitalWrite(motorTwo_InputOne,LOW);
      digitalWrite(motorTwo_InputTwo,HIGH);
      digitalWrite(motorOne_InputOne,HIGH);
      digitalWrite(motorOne_InputTwo,LOW);
    }
    if(c=='L'){
      Serial.println("Turning Left");
      digitalWrite(motorTwo_InputOne,HIGH);
      digitalWrite(motorTwo_InputTwo,LOW);
      digitalWrite(motorOne_InputOne,LOW);
      digitalWrite(motorOne_InputTwo,HIGH);
    }
    if(c=='F'){
      Serial.println("Forward");
      digitalWrite(motorTwo_InputOne,HIGH);
      digitalWrite(motorTwo_InputTwo,LOW);
      digitalWrite(motorOne_InputOne,HIGH);
      digitalWrite(motorOne_InputTwo,LOW);
    }
    if(c=='B'){
      Serial.println("Backward");
      digitalWrite(motorTwo_InputOne,LOW);
      digitalWrite(motorTwo_InputTwo,HIGH);
      digitalWrite(motorOne_InputOne,LOW);
      digitalWrite(motorOne_InputTwo,HIGH);
    }
  }else{
    digitalWrite(led,LOW);
  }
}
