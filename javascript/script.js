//массив точек
var dotArray = new Array();
//массив для передачи "бумаги"
var paperArray = new Array();
//массив линий
var lineArray = new Array();
var k = 0;
// массив номеров точек, потребуется для алгоритма Грэхема 
dotNumber = [];
// массив с номера отсортированных функцией graham точек
sortredArray = [];
//рисуется рабочую плоскость
window.onload = function(){
var paper = Raphael(300,100,700,500);
var rectangle = paper.rect(0,0,700,500);
rectangle.attr("fill","#fff");
paperArray[0] = paper;
paperArray[1] = rectangle;
var i=0;
paperArray[1].click(function(e)
{
var myCircle = paperArray[0].circle(e.pageX-300,e.pageY-100,1);
myCircle.attr("fill","#000");
var myDot = {x:e.pageX-300,y:e.pageY-100};
dotArray[i] = myDot;
dotNumber[i] = i;
i=i+1;
});
}
//выполняет сортировку и начинается анимированное рисование
function drawLine()
{
graham();
var line = paperArray[0].path("M " + dotArray[ sortredArray[0] ].x + " " + dotArray[ sortredArray[0] ].y);
line.animate({path:"M "+dotArray[ sortredArray[0] ].x+","+dotArray[ sortredArray[0] ].y + " L " + dotArray[ sortredArray[1] ].x + "," + dotArray[ sortredArray[1] ].y},1000,callbackAnimate);
lineArray[0] = line;
}
//следующие две функции поочердно вызывают друг друга, т.к. я не смог нормально настроить рекурсию, а в цикле for все линии рисовались одновременно
function callbackAnimate()
{
k=k+1;
if(k<sortredArray.length-1)
{
var line2 = paperArray[0].path("M " + dotArray[ sortredArray[k] ].x + " " + dotArray[ sortredArray[k] ].y);
line2.animate({path:"M " + dotArray[ sortredArray[k] ].x + "," + dotArray[ sortredArray[k] ].y + " L " + dotArray[ sortredArray[k+1] ].x + "," + dotArray[ sortredArray[k+1] ].y},1000,anothercallback);
lineArray[k] = line2;
}
else
{
var line2 = paperArray[0].path("M"+dotArray[ sortredArray[k] ].x+","+dotArray[ sortredArray[k] ].y);
line2.animate({path:"M " + dotArray[ sortredArray[k] ].x + "," + dotArray[ sortredArray[k] ].y + " L " + dotArray[ sortredArray[0] ].x + "," + dotArray[ sortredArray[0] ].y},1000);
lineArray[k] = line2;
}
}
function anothercallback()
{
k=k+1;
if(k<sortredArray.length-1)
{
var line2 = paperArray[0].path("M " + dotArray[ sortredArray[k] ].x + " " + dotArray[ sortredArray[k] ].y);
line2.animate({path:"M " + dotArray[ sortredArray[k] ].x + "," + dotArray[ sortredArray[k] ].y + " L " + dotArray[ sortredArray[k+1] ].x + "," + dotArray[ sortredArray[k+1] ].y},1000,callbackAnimate);
lineArray[k] = line2;
}
else
{
var line2 = paperArray[0].path("M"+dotArray[ sortredArray[k] ].x+","+dotArray[ sortredArray[k] ].y);
line2.animate({path:"M " + dotArray[ sortredArray[k] ].x + "," + dotArray[ sortredArray[k] ].y + " L " + dotArray[ sortredArray[0] ].x + "," + dotArray[ sortredArray[0] ].y},1000);
lineArray[k] = line2;
}
}

//функция вычисления векторного произведения
function classify(vector, x1, y1)
{
return pr = (vector.x2 - vector.x1) * (y1 - vector.y1) - (vector.y2 - vector.y1) * (x1 - vector.x1);
}

//функция сортировки (записывает номера искомых точек в массив sortredArray)
function graham() {
var minI = 0; 
var min = dotArray[0].x;

for (var i = 1; i < dotArray.length; i++) {
if (dotArray[i].x < min) {
min = dotArray[i].x;
minI = i;
}
}

dotNumber[0] = minI;
dotNumber[minI] = 0;

for (var i = 1; i < dotNumber.length - 1; i++) {
for (var j = i + 1; j < dotNumber.length; j++) {
var cl = classify({
'x1': dotArray[ dotNumber[0] ].x,
'y1': dotArray[ dotNumber[0] ].y,
'x2': dotArray[ dotNumber[i] ].x,
'y2': dotArray[ dotNumber[i] ].y
}, dotArray[ dotNumber[j] ].x, dotArray[ dotNumber[j] ].y) 

if (cl < 0) {
temp = dotNumber[i];
dotNumber[i] = dotNumber[j];
dotNumber[j] = temp;
}
}
}

sortredArray = [];
sortredArray[0] = dotNumber[0];
sortredArray[1] = dotNumber[1]; 

for (var i = 2; i < dotNumber.length; i++) {
while (classify({
'x1': dotArray[ sortredArray[sortredArray.length - 2] ].x,
'y1': dotArray[ sortredArray[sortredArray.length - 2] ].y,
'x2': dotArray[ sortredArray[sortredArray.length - 1] ].x,
'y2': dotArray[ sortredArray[sortredArray.length - 1] ].y
}, dotArray[ dotNumber[i] ].x, dotArray[ dotNumber[i] ].y) < 0)
{
sortredArray.pop(); 
}

sortredArray.push(dotNumber[i]); 
} 
}
function clearArrays()
{
dotArray = [];
lineArray = [];
sortredArray = [];
dotNumber = [];
}

function clearDesk()
{
k=0;
clearArrays();
paperArray[0].clear();
var paper = Raphael(300,100,700,500);
var rectangle = paper.rect(0,0,700,500);
rectangle.attr("fill","#fff");
paperArray[0] = paper;
paperArray[1] = rectangle;
var i=0;
paperArray[1].click(function(e)
{
var myCircle = paperArray[0].circle(e.pageX-300,e.pageY-100,1);
myCircle.attr("fill","#000");
var myDot = {x:e.pageX-300,y:e.pageY-100};
dotArray[i] = myDot;
dotNumber[i] = i;
i=i+1;
});
}
function deleteLines()
{
k=0;
for(var j=0;j<sortredArray.length;j++)
{
lineArray[j].animate({path:"M " + dotArray[ sortredArray[j] ].x + "," + dotArray[ sortredArray[j] ].y + " L " + dotArray[ sortredArray[j] ].x + "," + dotArray[ sortredArray[j] ].y});
}
lineArray = [];
sortredArray = [];
dotNumber = [];
for(var j=0;j<dotArray.length;j++)
{
dotNumber[j] = j;
}
}

function redrawlines()
{
deleteLines();
drawLine();
}