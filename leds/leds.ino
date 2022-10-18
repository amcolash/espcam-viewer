#include <tinyNeoPixel_Static.h>

#define NUMLEDS 7

byte pixels[NUMLEDS * 3];
tinyNeoPixel leds = tinyNeoPixel(NUMLEDS, PIN_PA6, NEO_GRB, pixels);

void setup() {
  pinMode(PIN_PA6, OUTPUT);
  pinMode(PIN_PA7, INPUT);
}

void loop() {
  uint8_t color = 0;
  if (digitalRead(PIN_PA7)) color = 255;

  for (uint8_t i = 0; i < NUMLEDS; i++) {
    leds.setPixelColor(i, color, color, color);
  }
  
  leds.show();  
}
