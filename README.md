# TrustBuster
A simple take on a classic game of trust

# To Run
ng serve

# Notes
ng new trustbuster --prefix=tb --routing --strict --view-encapsulation=ShadowDom --style=scss

ng add @angular/pwa

ng add @angular/material

ng generate component board --display-block
ng generate component boardSpot --display-block
ng generate component game --display-block
ng generate class \board\boardState
ng g class \board-spot\spotState
ng g class \player\playerState
ng g service \player\playerMove
ng g component \player\targetAction