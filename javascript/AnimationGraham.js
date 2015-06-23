/*В этом файле написан код для визуализации построения выпуклой оболочки*/

/*Запускаемая функция*/
function DrawLines()
{
	graham();
	SetGramahLines();
	MainShow();
	FillDeloneEdges();
}

/*Объект, созданный специально для визуализации*/
function VisualGrahamLine(x1, y1, x2, y2, mustpop)
{
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.mustpop = mustpop;
	this.mustshow = true;
	this.isDuplicate = false;
}

/*Массив для элементов, созданных с помощью VisualGrahamLine*/
var visualGrahamLines = new Array();

/*Создание всех линий, которые могут быть построены. Создаются невидимыми*/
function SetGramahLines()
{
	for(var i = 0; i < lineGrahamArray.length; i++)
	{
		var line = paperArray[0].path("M "+lineGrahamArray[i].x1+","+lineGrahamArray[i].y1);		
		if(i+1 >= lineGrahamArray.length)
		{
			line.animate({path:"M " + lineGrahamArray[i].x1 +"," + lineGrahamArray[i].y1 +" L " + lineGrahamArray[i].x2 +"," + lineGrahamArray[i].y2}, 0);
			line.hide();
			animatedArray.push(line);
			var visual = new VisualGrahamLine(lineGrahamArray[i].x1,lineGrahamArray[i].y1,lineGrahamArray[i].x2,lineGrahamArray[i].y2,lineGrahamArray[i].mustpop);
			visualGrahamLines.push(visual);
			
			line = paperArray[0].path("M "+lineGrahamArray[i].x2+","+lineGrahamArray[i].y2);
			line.animate({path:"M " + lineGrahamArray[i].x2 +"," + lineGrahamArray[i].y2 +" L " + lineGrahamArray[i].x3 +"," + lineGrahamArray[i].y3}, 0);
			line.hide();
			animatedArray.push(line);
			visual = new VisualGrahamLine(lineGrahamArray[i].x2,lineGrahamArray[i].y2,lineGrahamArray[i].x3,lineGrahamArray[i].y3,lineGrahamArray[i].mustpop);
			visualGrahamLines.push(visual);
			
			line = paperArray[0].path("M "+lineGrahamArray[i].x3+","+lineGrahamArray[i].y3);
			line.animate({path:"M " + lineGrahamArray[i].x3 +"," + lineGrahamArray[i].y3 +" L " + lineGrahamArray[0].x1 +"," + lineGrahamArray[0].y1}, 0);
			visual = new VisualGrahamLine(lineGrahamArray[i].x3,lineGrahamArray[i].y3,lineGrahamArray[0].x1,lineGrahamArray[0].y1,false);
			visualGrahamLines.push(visual);
		}
		else
		{
			line.animate({path:"M " + lineGrahamArray[i].x1 +"," + lineGrahamArray[i].y1 +" L " + lineGrahamArray[i].x2 +"," + lineGrahamArray[i].y2},0);
			var visual = new VisualGrahamLine(lineGrahamArray[i].x1,lineGrahamArray[i].y1,lineGrahamArray[i].x2,lineGrahamArray[i].y2,lineGrahamArray[i].mustpop);
			visualGrahamLines.push(visual);
		}
		line.hide();
		animatedArray.push(line);
	}
}

/*Проверка линий на наличие дубликатов*/
function CheckDuplicates(line)
{
	var orderArray = new Array();
	for(var i = 0; i < visualGrahamLines.length; i++)
	{
		var line2 = visualGrahamLines[i];
		if(line.x1 == line2.x1
		&& line.y1 == line2.y1
		&& line.x2 == line2.x2
		&& line.y2 == line2.y2)
		{
			orderArray.push(i);
		}
	}
	var check = false;
	for(var j = 0; j < orderArray.length; j++)
	{
		if(visualGrahamLines[ orderArray[j] ].mustpop == true)
		{
			check = true;
		}
	}
	
	if(check == true)
	{
		for(var k = 0; k < orderArray.length; k++)
		{
			visualGrahamLines[ orderArray[k] ].isDuplicate = true;
		}
	}
}

/*Чтобы визуализация была корректна, должны быть две функции с идентичным кодом, которые вызывают друг друга.
Основная функция визуализации, делает линии видимыми в определённом порядке*/
function MainShow()
{
	if(grahamCount == visualGrahamLines.length) return;
	
	var line = visualGrahamLines[grahamCount];
	if(line.mustshow == true)
	{
		animatedArray[grahamCount].show();
	}

	if(line.mustpop == true)
	{
		setTimeout(MainHide, 500, animatedArray[grahamCount]);
		CheckDuplicates(visualGrahamLines[grahamCount-1]);
		if(visualGrahamLines[grahamCount-1].isDuplicate == true)
		{
			setTimeout(MainHide, 500, animatedArray[grahamCount-1]);
		}
		if(grahamCount > 2)
		{
			CheckDuplicates(visualGrahamLines[grahamCount-2]);
			if(visualGrahamLines[grahamCount-2].isDuplicate == true)
			{
				setTimeout(MainHide, 1000, animatedArray[grahamCount-2]);
			}
		}
	}
	
	grahamCount++;	
	setTimeout(CallbackShow, 500);
}

/*Вспомогательная функция визуализации, делает линии видимыми в определённом порядке*/
function CallbackShow()
{
	if(grahamCount == visualGrahamLines.length) return;
	
	var line = visualGrahamLines[grahamCount];
	if(line.mustshow == true)
	{
		animatedArray[grahamCount].show();
	}

	if(line.mustpop == true)
	{
		setTimeout(MainHide, 500, animatedArray[grahamCount]);
		CheckDuplicates(visualGrahamLines[grahamCount-1]);
		if(visualGrahamLines[grahamCount-1].isDuplicate == true)
		{
			setTimeout(MainHide, 500, animatedArray[grahamCount-1]);
		}
		if(grahamCount > 2)
		{
			CheckDuplicates(visualGrahamLines[grahamCount-2]);
			if(visualGrahamLines[grahamCount-2].isDuplicate == true)
			{
				setTimeout(MainHide, 1000, animatedArray[grahamCount-2]);
			}
		}
	}
	
	grahamCount++;
	setTimeout(MainShow, 500);
}

/*Основная функция визуализации, которая прячет ненужные построенные линии во время работы MainShow и CallbackShow*/
function MainHide(animatedLine)
{
	animatedLine.hide();	
}