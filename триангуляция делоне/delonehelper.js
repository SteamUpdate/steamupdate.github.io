function DelonePoint(coordX, coordY)
{
this.X = coordX;
this.Y = coordY;
}

function CreateDeloneEdge(startPoint, endPoint)
{
this.StartPoint = startPoint;
this.EndPoint = endPoint;
}

function CreateExtDot(point, index)
{
this.Point = point;
this.Index = index;
this.CosAngle = 0;
}

function DeloneEdge(xS, yS, xE, yE)
{
this.StartPoint = new DelonePoint(xS, yS);
this.EndPoint = new DelonePoint(xE, yE);
}

function DeloneTriangle(point1, point2, point3)
{
this.Point1 = point1;
this.Point2 = point2;
this.Point3 = point3;
this.Edge1 = new DeloneEdge(point1, point2);
this.Edge2 = new DeloneEdge(point2, point3);
this.Edge3 = new DeloneEdge(point1, point3);
}

function CoeffA(point1, point2, point3)
{
var result = point1.X * point2.Y + point3.Y*point2.X + point1.Y*point3.X - point2.Y*point3.X - point1.X*point3.Y - point1.Y*point2.X;
return result;
}

function CoeffB(point1, point2, point3)
{
var result = (point1.X*point1.X + point1.Y*point1.Y) * point2.Y
				+ (point2.X*point2.X + point2.Y*point2.Y)*point3.Y
				+ (point3.X*point3.X + point3.Y*point3.Y)*point1.Y
				- (point3.X*point3.X + point3.Y*point3.Y)*point2.Y
				- (point1.X*point1.X + point1.Y*point1.Y)*point3.Y
				- (point2.X*point2.X + point2.Y*point2.Y)*point1.Y;
return result;
}

function CoeffC(point1, point2, point3)
{
var result = (point1.X*point1.X + point1.Y*point1.Y) * point2.X
				+ (point2.X*point2.X + point2.Y*point2.Y)*point3.X
				+ (point3.X*point3.X + point3.Y*point3.Y)*point1.X
				- (point3.X*point3.X + point3.Y*point3.Y)*point2.X
				- (point1.X*point1.X + point1.Y*point1.Y)*point3.X
				- (point2.X*point2.X + point2.Y*point2.Y)*point1.X;
return result;
}

function CoeffD(point1, point2, point3)
{
var result = (point1.X*point1.X + point1.Y*point1.Y) * point2.X * point3.Y
				+ (point2.X*point2.X + point2.Y*point2.Y)*point3.X * point1.Y
				+ (point3.X*point3.X + point3.Y*point3.Y)*point1.X * point2.Y
				- (point3.X*point3.X + point3.Y*point3.Y)*point2.X * point1.Y
				- (point1.X*point1.X + point1.Y*point1.Y)*point3.X * point2.Y
				- (point2.X*point2.X + point2.Y*point2.Y)*point1.X * point3.Y;
return result;
}

//функция, рисующая круг вокруг треугольника
function DeloneCircle(point1, point2, point3)
{
	var a = CoeffA(point1, point2, point3);
	var b = CoeffB(point1, point2, point3);
	var c = CoeffC(point1, point2, point3);

	this.CenterX = b/(2*a);
	this.CenterY = (-c)/(2*a);

	var aa = Math.sqrt((point2.X - point1.X)*(point2.X - point1.X) + (point2.Y - point1.Y)*(point2.Y - point1.Y));
	var bb = Math.sqrt((point3.X - point2.X)*(point3.X - point2.X) + (point3.Y - point2.Y)*(point3.Y - point2.Y));
	var cc = Math.sqrt((point3.X - point1.X)*(point3.X - point1.X) + (point3.Y - point1.Y)*(point3.Y - point1.Y));
	var p = (aa+bb+cc)/2;
	this.Radius2 = (aa*bb*cc)/(4*Math.sqrt(p*(p-aa)*(p-bb)*(p-cc)));
}

//функция поиска косинуса угла
function FindCosAngle(deloneEdge1, deloneEdge2)
{
	var x1 = deloneEdge1.EndPoint.X - deloneEdge1.StartPoint.X;
	var x2 = deloneEdge2.EndPoint.X - deloneEdge2.StartPoint.X;
	var y1 = deloneEdge1.EndPoint.Y - deloneEdge1.StartPoint.Y;
	var y2 = deloneEdge2.EndPoint.Y - deloneEdge2.StartPoint.Y;
	var modul = Math.abs(x1*x2+y1*y2);
	var firstSqrt = Math.sqrt(x1*x1 + y1*y1);
	var secondSqrt = Math.sqrt(x2*x2 + y2*y2);
	return modul/(firstSqrt * secondSqrt);
}

//создание пузыря
function CreateBubble(deloneEdge)
{
	var xS = deloneEdge.StartPoint.X;
	var xE = deloneEdge.EndPoint.X;
	var yS = deloneEdge.StartPoint.Y;
	var yE = deloneEdge.EndPoint.Y;

	this.CenterX = (xS+xE)/2;
	this.CenterY = (yS+yE)/2;
	this.Diametr = Math.sqrt((xE-xS)*(xE-xS)+(yE-yS)*(yE-yS));
	this.Radius = this.Diametr/2;
}
//функция, проверяющая точку на её наличие в "пузыре"
function CheckDotIntoBubble(delonePoint, bubble)
{
	var x = delonePoint.X;
	var y = delonePoint.Y;
	var xC = bubble.CenterX;
	var yC = bubble.CenterY;
	var r = bubble.Radius;

	if( (x-xC)*(x-xC)+(y-yC)*(y-yC) < r*r )
	{
	return true;
	}
	else
	{
	return false;
	}
}

/*
function DeleteElementFromArray(element, array)
{
	for(var f = 0; f < array.length; f++)
	{
		if(array[f].X == element.X)
		{
			if(array[f].Y == element.Y)
			{
				array.splice(f, 1);
			}
		}
	}
}*/

//функция, проверяющая, существует ли данное ребро в массиве		
function CheckEdge(edge, array)
{	
	for(var f = 0; f < array.length; f++)
	{			
		if(array[f].StartPoint.X == edge.StartPoint.X && array[f].StartPoint.Y == edge.StartPoint.Y)
		{			
			if(array[f].EndPoint.X == edge.EndPoint.X && array[f].EndPoint.Y == edge.EndPoint.Y)
			{
				return true;
			}
		}

		if(array[f].EndPoint.X == edge.StartPoint.X && array[f].EndPoint.Y == edge.StartPoint.Y)
		{
			if(array[f].StartPoint.X == edge.EndPoint.X && array[f].StartPoint.Y == edge.EndPoint.Y)
			{				
				return true;
			}
		}			
	}	
	return false;
}

//функция, вовзращающая точку из массива по минимальному значению косинуса
function FindDotInArray(value, array)
{
	for(var f = 0; f < array.length; f++)
	{
		if(array[f].CosAngle == value)
		{
			return array[f];
		}
	}
	return -1;
}

//функция, проверяющая, являютсяли две точки одинаковыми
function CheckPoint(dot1, dot2)
{
	if(dot1.X == dot2.X && dot1.Y == dot2.Y)
	{
		return true;
	}
	else 
	{
		return false;
	}
}

//функция проверки пересечения рёбер
function CheckCrossEdges(edge1, edge2)
{
	var ax1 = edge1.StartPoint.X;
	var ay1 = edge1.StartPoint.Y;
	var ax2 = edge1.EndPoint.X;
	var ay2 = edge1.EndPoint.Y;
	var bx1 = edge2.StartPoint.X;
	var by1 = edge2.StartPoint.Y;
	var bx2 = edge2.EndPoint.X;
	var by2 = edge2.EndPoint.Y;
	
	var v1 = (bx2-bx1)*(ay1-by1)-(by2-by1)*(ax1-bx1);
	var v2 = (bx2-bx1)*(ay2-by1)-(by2-by1)*(ax2-bx1);
	var v3 = (ax2-ax1)*(by1-ay1)-(ay2-ay1)*(bx1-ax1);
	var v4 = (ax2-ax1)*(by2-ay1)-(ay2-ay1)*(bx2-ax1);	
	
	var result1 = false;
	var result2 = false;
	
	if(v1*v2 < 0)
	{
		result1 = true;
	}
	else
	{
		result1 = false;
	}
	
	if(v3*v4 < 0)
	{
		result2 = true;
	}
	else
	{
		result2 = false;
	}
	
	return (result1 && result2);
}

//функция проверки пересечения ребра с ребрами в массиве
function CheckCrossEdgesInArray(edge, array)
{
	for(var f = 0; f < array.length; f++)
	{
		var check123 = CheckCrossEdges(edge, array[f]);
		if(check123 == true) return true;
	}
	return false;
}