//массив точек
var dotArray = new Array();
//массив точек внутри пузыря
var bubbleDotArray = new Array();
//массив точек Делоне
var deloneDotArray = new Array();
//массив для передачи "бумаги"
var paperArray = new Array();
//массив линий
var lineArray = new Array();
//массив базовых линий
var baseEdgesArray = new Array();
//массив линий триангуляции
var deloneEdgesArray = new Array();
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
var myCircle = paperArray[0].circle(e.pageX-300,e.pageY-100,5);
myCircle.attr("fill","#f00");
var myDot = {x:e.pageX-300,y:e.pageY-100};
deloneDotArray[i] = new DelonePoint(myDot.x, myDot.y);
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
line.animate({path:"M "+dotArray[ sortredArray[0] ].x+","+dotArray[ sortredArray[0] ].y + " L " + dotArray[ sortredArray[1] ].x + "," + dotArray[ sortredArray[1] ].y},10,callbackAnimate);
lineArray[0] = line;
var edge = new DeloneEdge(dotArray[ sortredArray[0] ].x, dotArray[ sortredArray[0] ].y, dotArray[ sortredArray[1] ].x, dotArray[ sortredArray[1] ].y);
deloneEdgesArray.push(edge);
}
//следующие две функции поочердно вызывают друг друга, т.к. я не смог нормально настроить рекурсию, а в цикле for все линии рисовались одновременно
function callbackAnimate()
{
k=k+1;
if(k<sortredArray.length-1)
{
var line2 = paperArray[0].path("M " + dotArray[ sortredArray[k] ].x + " " + dotArray[ sortredArray[k] ].y);
line2.animate({path:"M " + dotArray[ sortredArray[k] ].x + "," + dotArray[ sortredArray[k] ].y + " L " + dotArray[ sortredArray[k+1] ].x + "," + dotArray[ sortredArray[k+1] ].y},10,anothercallback);
lineArray[k] = line2;
var edge = new DeloneEdge(dotArray[ sortredArray[k] ].x, dotArray[ sortredArray[k] ].y, dotArray[ sortredArray[k+1] ].x, dotArray[ sortredArray[k+1] ].y);
deloneEdgesArray.push(edge);
}
else
{
var line2 = paperArray[0].path("M"+dotArray[ sortredArray[k] ].x+","+dotArray[ sortredArray[k] ].y);
line2.animate({path:"M " + dotArray[ sortredArray[k] ].x + "," + dotArray[ sortredArray[k] ].y + " L " + dotArray[ sortredArray[0] ].x + "," + dotArray[ sortredArray[0] ].y},10);
lineArray[k] = line2;
var edge = new DeloneEdge(dotArray[ sortredArray[k] ].x, dotArray[ sortredArray[k] ].y, dotArray[ sortredArray[0] ].x, dotArray[ sortredArray[0] ].y);
deloneEdgesArray.push(edge);
}
}
function anothercallback()
{
k=k+1;
if(k<sortredArray.length-1)
{
var line2 = paperArray[0].path("M " + dotArray[ sortredArray[k] ].x + " " + dotArray[ sortredArray[k] ].y);
line2.animate({path:"M " + dotArray[ sortredArray[k] ].x + "," + dotArray[ sortredArray[k] ].y + " L " + dotArray[ sortredArray[k+1] ].x + "," + dotArray[ sortredArray[k+1] ].y},10,callbackAnimate);
lineArray[k] = line2;
var edge = new DeloneEdge(dotArray[ sortredArray[k] ].x, dotArray[ sortredArray[k] ].y, dotArray[ sortredArray[k+1] ].x, dotArray[ sortredArray[k+1] ].y);
deloneEdgesArray.push(edge);
}
else
{
var line2 = paperArray[0].path("M"+dotArray[ sortredArray[k] ].x+","+dotArray[ sortredArray[k] ].y);
line2.animate({path:"M " + dotArray[ sortredArray[k] ].x + "," + dotArray[ sortredArray[k] ].y + " L " + dotArray[ sortredArray[0] ].x + "," + dotArray[ sortredArray[0] ].y},10);
lineArray[k] = line2;
var edge = new DeloneEdge(dotArray[ sortredArray[k] ].x, dotArray[ sortredArray[k] ].y, dotArray[ sortredArray[0] ].x, dotArray[ sortredArray[0] ].y);
deloneEdgesArray.push(edge);
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
var myCircle = paperArray[0].circle(e.pageX-300,e.pageY-100,5);
myCircle.attr("fill","#f00");
var myDot = {x:e.pageX-300,y:e.pageY-100};
deloneDotArray[i] = new DelonePoint(myDot.x, myDot.y);
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

function DrawTriangleCircle()
{
var delonePoint1 = new DelonePoint(dotArray[ sortredArray[0] ].x,dotArray[ sortredArray[0] ].y);
var delonePoint2 = new DelonePoint(dotArray[ sortredArray[1] ].x,dotArray[ sortredArray[1] ].y);
var delonePoint3 = new DelonePoint(dotArray[ sortredArray[2] ].x,dotArray[ sortredArray[2] ].y);
var deloneCircle = new DeloneCircle(delonePoint1,delonePoint2,delonePoint3);
//alert(deloneCircle.CenterX + ' ' + deloneCircle.CenterY + ' ' + deloneCircle.Radius);
var myCircle = paperArray[0].circle(deloneCircle.CenterX,deloneCircle.CenterY,deloneCircle.Radius2);
//myCircle.attr("fill","#f00");
}

function DrawBuble()
{
var diametr = Math.sqrt(
(dotArray[ sortredArray[1] ].x-dotArray[ sortredArray[0] ].x)*(dotArray[ sortredArray[1] ].x-dotArray[ sortredArray[0] ].x) + (dotArray[ sortredArray[1] ].y-dotArray[ sortredArray[0] ].y)*(dotArray[ sortredArray[1] ].y-dotArray[ sortredArray[0] ].y)
);
paperArray[0].circle((dotArray[ sortredArray[0] ].x + dotArray[ sortredArray[1] ].x)/2,(dotArray[ sortredArray[0] ].y + dotArray[ sortredArray[1] ].y)/2,diametr);
}

function DrawTriangulate()
{
	//количество всех точек триангуляции
	var N = dotArray.length;
	//количесво ребер на внешней границе триангуляции
	var C = deloneEdgesArray.length;
	//количество всех ребёр триангуляции
	var R = 3*N - C - 3;
	//количество всех треугольников триангуляции
	var T = 0;
	
	console.log(R);
	
	//пошаговый алгоритм
	var startPoint = new DelonePoint(dotArray[sortredArray[0]].x, dotArray[sortredArray[0]].y);
	var endPoint = new DelonePoint(dotArray[sortredArray[1]].x, dotArray[sortredArray[1]].y);
	
	//базовая линия
	var baseEdge = new CreateDeloneEdge(startPoint, endPoint);
	baseEdgesArray.push(baseEdge);
	
	var baseLine = paperArray[0].path("M " + baseEdge.StartPoint.X + " " + baseEdge.StartPoint.Y);
		baseLine.animate({path:"M "+baseEdge.StartPoint.X+","+baseEdge.StartPoint.Y + " L " + baseEdge.EndPoint.X + "," + baseEdge.EndPoint.Y},10);
		baseLine.attr("stroke","#0f0");
	
	//цикл построения триангуляции 
	while(deloneEdgesArray.length != R)
	{
		//строим пузырь на основе базовой линии
		var bubble = new CreateBubble(baseEdge);			
		
		//массив для сортировки значений косинусов
		var cosSortArray = new Array();
		
		while(bubbleDotArray.length == 0)
		{
			//ищем точки внутри пузыря
			for(var f = 0; f < deloneDotArray.length; f++)
			{
				if(CheckPoint(baseEdge.StartPoint, deloneDotArray[f])) continue;
				if(CheckPoint(baseEdge.EndPoint, deloneDotArray[f])) continue;
				var result = CheckDotIntoBubble(deloneDotArray[f], bubble);		
				if(result == true)
				{
					var edge1 = new CreateDeloneEdge(baseEdge.StartPoint, deloneDotArray[f]);
					var edge2 = new CreateDeloneEdge(baseEdge.EndPoint, deloneDotArray[f]);
					var crossEdge1 = CheckCrossEdgesInArray(edge1, deloneEdgesArray);
					var crossEdge2 = CheckCrossEdgesInArray(edge2, deloneEdgesArray);					
					if(!crossEdge1 && !crossEdge2)
					{
						var firstCheck = CheckEdge(edge1, deloneEdgesArray);
						var secondCheck = CheckEdge(edge2, deloneEdgesArray);
						if(!firstCheck || !secondCheck)
						{
							var dotExt = new CreateExtDot(deloneDotArray[f], f);
							bubbleDotArray.push(dotExt);
						}
					}
				}
			}
		//	paperArray[0].circle(bubble.CenterX,bubble.CenterY,bubble.Radius);
			var myRadius = bubble.Radius * 2;
			bubble.Radius = myRadius;			
		}
		
		var bubbleDotArray2 = new Array();
		
		//поиск косинусов углов
		for(var f = 0; f < bubbleDotArray.length; f++)
		{
			var dot = bubbleDotArray[f];
			var firstEdge = new CreateDeloneEdge(baseEdge.StartPoint, dot.Point);
			var secondEdge = new CreateDeloneEdge(baseEdge.EndPoint, dot.Point);
			var result = FindCosAngle(firstEdge, secondEdge);			
			dot.CosAngle = result;
			bubbleDotArray2.push(dot);
			cosSortArray.push(result);
		}
				
		//сортировка значений - ищем наименьший
		var csa = cosSortArray.sort(function(a, b)
		{
			return a-b;
		});		
			
		//минимальное значение
		var minValue = csa[0];
	//	console.log(minValue);
		//ищем соответ точку
		var deloneDotExt = FindDotInArray(minValue, bubbleDotArray2);
		//найденный сосед делоне
		var deloneDot = deloneDotExt.Point;
		//строим треугольник
		//два новых базовых ребра
		var baseEdge1 = new CreateDeloneEdge(baseEdge.StartPoint, deloneDot);
		var baseEdge2 = new CreateDeloneEdge(baseEdge.EndPoint, deloneDot);		
		
		//рисуем треугольник	
		var check = CheckEdge(baseEdge1, deloneEdgesArray);
		if(check == false)
		{
			var line = paperArray[0].path("M " + baseEdge.StartPoint.X + " " + baseEdge.StartPoint.Y);
			//line.animate({path:"M "+baseEdge.StartPoint.X+","+baseEdge.StartPoint.Y + " L " + deloneDot.X + "," + deloneDot.Y},10);
			line.animate({path:"M "+baseEdge1.StartPoint.X+","+baseEdge1.StartPoint.Y + " L " + baseEdge1.EndPoint.X + "," + baseEdge1.EndPoint.Y},10);
			line.attr("stroke","#03c");
			deloneEdgesArray.push(baseEdge1);
			//var bubble1 = new CreateBubble(baseEdge1);
			//paperArray[0].circle(bubble1.CenterX,bubble1.CenterY,bubble1.Radius);
		}	
		
		var check2 = CheckEdge(baseEdge2, deloneEdgesArray);
		if(check2 == false)
		{
			var line2 = paperArray[0].path("M " + baseEdge.EndPoint.X + " " + baseEdge.EndPoint.Y);
			line2.animate({path:"M "+baseEdge.EndPoint.X+","+baseEdge.EndPoint.Y + " L " + deloneDot.X + "," + deloneDot.Y},10);
			line2.attr("stroke","#f00");
			deloneEdgesArray.push(baseEdge2);
		}	
		
		//выбор следующего базового ребра	
				
		if(check == true)
		{
			baseEdge = baseEdge2;
		}
		else
		{
			baseEdge = baseEdge1;
		}
		
		bubbleDotArray = new Array();
	}
	console.log(deloneEdgesArray.length);
}