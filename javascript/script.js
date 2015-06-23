/*В этом файле выполняется основная работа - создание рабочей плоскости, заполнение точками,
алгоритмы для построения выпуклой оболочки и триангуляции Делоне.*/

/*массив точек*/
var dotArray = new Array();
/*массив линий для визуализации алгоритма Грэхема*/
var lineGrahamArray = new Array();
/*счетчик для массива линий Грэхема*/
var grahamCount = 0;
/*массив линий для анимации*/
var animatedArray = new Array();
/*массив точек внутри пузыря*/
var bubbleDotArray = new Array();
/*массив точек Делоне*/
var deloneDotArray = new Array();
/*массив для передачи "бумаги"*/
var paperArray = new Array();
/*массив базовых линий*/
var baseEdgesArray = new Array();
/*массив линий триангуляции*/
var deloneEdgesArray = new Array();
/*массив для статического примера или отладки*/
var debugArray = new Array();
/*массив линий для визуализации алгоритма Делоне*/
var visualDeloneArray = new Array();
/*специальный объект для визуализации алгоритма Делоне*/
var deloneArray = new Array();


var k = 0;
/*массив номеров точек, потребуется для алгоритма Грэхема*/
dotNumber = [];
/*массив с номера отсортированных функцией graham точек*/
sortredArray = [];
/*рисуется рабочую плоскость*/
window.onload = function(){
var paper = Raphael(300,100,700,500);
var rectangle = paper.rect(0,0,700,500);
rectangle.attr("fill","#fff");
paperArray[0] = paper;
paperArray[1] = rectangle;

/*Частный случай, задан статичный набор точек*/
/*debugArray[0] = {x:228, y:116};
debugArray[1] = {x:206, y:188};
debugArray[2] = {x:354, y:146};
debugArray[3] = {x:418, y:123};
debugArray[4] = {x:381, y:91};
debugArray[5] = {x:390, y:199};
debugArray[6] = {x:280, y:153};
debugArray[7] = {x:311, y:116};
debugArray[8] = {x:320, y:94};
debugArray[9] = {x:318, y:176};
debugArray[10] = {x:295, y:253};
debugArray[11] = {x:426, y:222};
debugArray[12] = {x:448, y:140};
debugArray[13] = {x:467, y:90};
debugArray[14] = {x:441, y:66};
debugArray[15] = {x:475, y:169};
debugArray[16] = {x:465, y:224};
debugArray[17] = {x:427, y:240};
debugArray[18] = {x:374, y:221};
debugArray[19] = {x:327, y:145};
debugArray[20] = {x:361, y:69};
debugArray[21] = {x:250, y:69};
var i=0;
for(var f=0; f<22; f++)
{
var myCircle = paperArray[0].circle(debugArray[f].x,debugArray[f].y,5);
myCircle.attr("fill","#f00");
var myDot = {x:debugArray[f].x, y:debugArray[f].y};
deloneDotArray[i] = new DelonePoint(myDot.x, myDot.y);
dotArray[i] = myDot;
dotNumber[i] = i;
i=i+1;
}*/

/*Раскоментировать для общего случая, точки создаются по клику мыши в том месте рабочей плоскости, где находился курсор*/
var i = 0;
paperArray[1].click(function(e)
{
var myCircle = paperArray[0].circle(e.pageX-300,e.pageY-100,5);
myCircle.attr("fill","#f00");
var myDot = {x:e.pageX-300,y:e.pageY-100};
console.log(myDot.x, myDot.y);
deloneDotArray[i] = new DelonePoint(myDot.x, myDot.y);
dotArray[i] = myDot;
dotNumber[i] = i;
i=i+1;
});
}

function FillDeloneEdges()
{
	for(var i = 0; i < sortredArray.length; i++)
	{
		if(i < sortredArray.length-1)
		{
			var edge = new DeloneEdge(dotArray[ sortredArray[i] ].x, dotArray[ sortredArray[i] ].y, dotArray[ sortredArray[i+1] ].x, dotArray[ sortredArray[i+1] ].y);
			deloneEdgesArray.push(edge);
		}
		else
		{
			var edge = new DeloneEdge(dotArray[ sortredArray[i] ].x, dotArray[ sortredArray[i] ].y, dotArray[ sortredArray[0] ].x, dotArray[ sortredArray[0] ].y);
			deloneEdgesArray.push(edge);
		}
	}
}

function GrahamEdge(x1, y1, x2, y2, x3, y3)
{
	this.mustpop = false;
	this.mustanimate = true;
	this.x1 = x1;
	this.x2 = x2;
	this.x3 = x3;
	this.y1 = y1;
	this.y2 = y2;
	this.y3 = y3;
	this.classify = classify({
		'x1': x1,
		'y1': y1,
		'x2': x2,
		'y2': y2
	}, x3, y3);
}

/*функция вычисления векторного произведения*/
function classify(vector, x1, y1)
{
	return pr = (vector.x2 - vector.x1) * (y1 - vector.y1) - (vector.y2 - vector.y1) * (x1 - vector.x1);
}

/*функция сортировки (записывает номера искомых точек в массив sortredArray)*/
function graham()
{
	var minI = 0; 
	var min = dotArray[0].x;

	for (var i = 1; i < dotArray.length; i++)
	{
		if (dotArray[i].x < min) 
		{
			min = dotArray[i].x;
			minI = i;
		}
	}

	dotNumber[0] = minI;
	dotNumber[minI] = 0;

	for (var i = 1; i < dotNumber.length - 1; i++)
	{
		for (var j = i + 1; j < dotNumber.length; j++) 
		{
			var vector = {'x1': dotArray[ dotNumber[0] ].x,
			'y1': dotArray[ dotNumber[0] ].y,
			'x2': dotArray[ dotNumber[i] ].x,
			'y2': dotArray[ dotNumber[i] ].y
			};
			var cl = classify(vector, dotArray[ dotNumber[j] ].x, dotArray[ dotNumber[j] ].y) 
			/*если векторное произведение меньше 0, следовательно вершина j левее вершины i.Меняем их местами*/
			if (cl < 0)
			{
				temp = dotNumber[i];
				dotNumber[i] = dotNumber[j];
				dotNumber[j] = temp;
			}
		}
	}

	sortredArray = [];
	sortredArray[0] = dotNumber[0];
	sortredArray[1] = dotNumber[1]; 

	for (var i = 2; i < dotNumber.length; i++) 
	{
		while (true)
		{
			var vector = {
				'x1': dotArray[ sortredArray[sortredArray.length - 2] ].x,
				'y1': dotArray[ sortredArray[sortredArray.length - 2] ].y,
				'x2': dotArray[ sortredArray[sortredArray.length - 1] ].x,
				'y2': dotArray[ sortredArray[sortredArray.length - 1] ].y
				};
			var grahamLine = new GrahamEdge(vector.x1, vector.y1, vector.x2, vector.y2, dotArray[ dotNumber[i] ].x, dotArray[ dotNumber[i] ].y);
			if(classify(vector, dotArray[ dotNumber[i] ].x, dotArray[ dotNumber[i] ].y) > 0) 
			{
				lineGrahamArray.push(grahamLine);
				break;
			}
			else
			{
				grahamLine.mustpop = true;
				lineGrahamArray.push(grahamLine);
				sortredArray.pop(); /*пока встречается правый поворот, убираем точку из оболочки*/
			}			
		}
		sortredArray.push(dotNumber[i]); /*добавляем новую точку в оболочку*/
	} 
}

function DrawTriangulate()
{
	/*количество всех точек триангуляции*/
	var N = dotArray.length;
	/*количесво ребер на внешней границе триангуляции*/
	var C = deloneEdgesArray.length;
	/*количество всех ребёр триангуляции*/
	var R = 3*N - C - 3;
	/*количество всех треугольников триангуляции*/
	var T = 0;
	
	/*массив "пузырей" для визуализации*/
	var bubbleArray = new Array();
	
	/*пошаговый алгоритм*/
	var startPoint = new DelonePoint(dotArray[sortredArray[0]].x, dotArray[sortredArray[0]].y);
	var endPoint = new DelonePoint(dotArray[sortredArray[1]].x, dotArray[sortredArray[1]].y);
	
	/*базовая линия*/
	var baseEdge = new CreateDeloneEdge(startPoint, endPoint);
	
	/*цикл построения триангуляции*/
	while(deloneEdgesArray.length != R)
	{
		/*объект для визуализации*/
		var visual = new Object();
		
		/*строим пузырь на основе базовой линии*/
		var bubble = new CreateBubble(baseEdge);
		
		visual.baseEdge = baseEdge;		
		
		/*массив для сортировки значений косинусов*/
		var cosSortArray = new Array();
		
		while(bubbleDotArray.length == 0)
		{			
			var innerBubble = paperArray[0].circle(bubble.CenterX, bubble.CenterY, bubble.Radius);
			innerBubble.hide();
			bubbleArray.push(innerBubble);
			
			/*ищем точки внутри пузыря*/
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
		
			var myRadius = bubble.Radius * 2;
			/*if(!isFinite(myRadius)) 
			Для данного случая взял органичение 300. Для общего случая использовать сравнение с бесконечностью (см. на строчку выше)*/
			if(myRadius >= 500)
			{
				/*Выделение цветом базовой линии*/
				var visual2 = new Object();
				visual2.baseEdge = baseEdge;
				visual2.bubbles = bubbleArray;
				var baseEdgeLine1 = paperArray[0].path("M " + baseEdge.StartPoint.X + " " + baseEdge.StartPoint.Y);
				baseEdgeLine1.animate({path:"M "+baseEdge.StartPoint.X+","+baseEdge.StartPoint.Y + " L " + baseEdge.EndPoint.X + "," + baseEdge.EndPoint.Y},500);
				baseEdgeLine1.attr("stroke","#f00");
				baseEdgeLine1.attr("stroke-width",4);
				baseEdgeLine1.hide();
				visual2.baseEdgeLine = baseEdgeLine1;
				deloneArray.push(visual2);
				bubbleArray = [];
				
				baseEdge = baseEdgesArray.pop();
				bubble = new CreateBubble(baseEdge);
				var innerBubble = paperArray[0].circle(bubble.CenterX, bubble.CenterY, bubble.Radius);
				innerBubble.hide();
				bubbleArray.push(innerBubble);				
			}
			else
			{
				bubble.Radius = myRadius;				
			}			
		}		
		
		/*Выделение цветом базовой линии*/
		var baseEdgeLine = paperArray[0].path("M " + baseEdge.StartPoint.X + " " + baseEdge.StartPoint.Y);
		baseEdgeLine.animate({path:"M "+baseEdge.StartPoint.X+","+baseEdge.StartPoint.Y + " L " + baseEdge.EndPoint.X + "," + baseEdge.EndPoint.Y},500);
		baseEdgeLine.attr("stroke","#f00");
		baseEdgeLine.attr("stroke-width",4);
		baseEdgeLine.hide();
		visual.baseEdgeLine = baseEdgeLine;
		visual.bubbles = bubbleArray;
		bubbleArray = [];
		
		var bubbleDotArray2 = new Array();
		
		/*поиск косинусов углов*/
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
				
		/*сортировка значений - ищем наименьший*/
		var csa = cosSortArray.sort(function(a, b)
		{
			return a-b;
		});		
			
		/*минимальное значение*/
		var minValue = csa[0];
		/*ищем соответ точку*/
		var deloneDotExt = FindDotInArray(minValue, bubbleDotArray2);
		/*найденный сосед делоне*/
		var deloneDot = deloneDotExt.Point;
		/*строим треугольник
		два новых базовых ребра*/
		var baseEdge1 = new CreateDeloneEdge(baseEdge.StartPoint, deloneDot);
		var baseEdge2 = new CreateDeloneEdge(baseEdge.EndPoint, deloneDot);		
		
		/*рисуем треугольник*/
		var check = CheckEdge(baseEdge1, deloneEdgesArray);
		if(check == false)
		{
			var line = paperArray[0].path("M " + baseEdge.StartPoint.X + " " + baseEdge.StartPoint.Y);
			line.animate({path:"M "+baseEdge1.StartPoint.X+","+baseEdge1.StartPoint.Y + " L " + baseEdge1.EndPoint.X + "," + baseEdge1.EndPoint.Y},500);
			line.hide();
			visual.edge1 = line;
			visualDeloneArray.push(line);
			deloneEdgesArray.push(baseEdge1);
		}	
		
		var check2 = CheckEdge(baseEdge2, deloneEdgesArray);
		if(check2 == false)
		{
			var line2 = paperArray[0].path("M " + baseEdge.EndPoint.X + " " + baseEdge.EndPoint.Y);
			line2.animate({path:"M "+baseEdge.EndPoint.X+","+baseEdge.EndPoint.Y + " L " + deloneDot.X + "," + deloneDot.Y},500);
			line2.hide();
			visual.edge2 = line2;
			visualDeloneArray.push(line2);
			deloneEdgesArray.push(baseEdge2);
		}	
		
		/*выбор следующего базового ребра*/
		if(check == true)
		{
			baseEdge = baseEdge2;
			baseEdgesArray.push(baseEdge1);
		}
		else
		{
			baseEdge = baseEdge1;
			baseEdgesArray.push(baseEdge2);
		}
		deloneArray.push(visual);
		bubbleDotArray = new Array();
	}
	
	VisualDelone();
}
