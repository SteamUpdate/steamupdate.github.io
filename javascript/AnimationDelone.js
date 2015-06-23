/*� ���� ����� ������� ��� ��� ������������ ���������� ������������ ������*/

/*��������*/
var visualDeloneCount = 0;
var bubbleCount = 0;

/*��������� ������*/
function VisualDelone()
{
	if(visualDeloneCount == deloneArray.length) return;
	deloneArray[visualDeloneCount].baseEdgeLine.show();
	setTimeout(ShowBubble, 500);	
}

/*�������� ������� ����������� "������"*/
function ShowBubble()
{
	if(bubbleCount == 0)
	{
		deloneArray[visualDeloneCount].bubbles[0].show();
		bubbleCount++;
		setTimeout(ShowBubbleCallback, 500);
	}
	else
	{
		if(bubbleCount == deloneArray[visualDeloneCount].bubbles.length)
		{			
			setTimeout(ShowEdges, 500);
		}
		else
		{
			deloneArray[visualDeloneCount].bubbles[bubbleCount-1].hide();
			deloneArray[visualDeloneCount].bubbles[bubbleCount].show();			
			bubbleCount++;
			setTimeout(ShowBubbleCallback, 500);
		}
	}
}

/*��������������� ������� ����������� "������"*/
function ShowBubbleCallback()
{
	if(bubbleCount == deloneArray[visualDeloneCount].bubbles.length)
	{
		setTimeout(ShowEdges, 500);
	}
	else
	{
		deloneArray[visualDeloneCount].bubbles[bubbleCount-1].hide();
		deloneArray[visualDeloneCount].bubbles[bubbleCount].show();		
		bubbleCount++;
		setTimeout(ShowBubble, 500);
	}
}

/*������� ����������� ����� ����������� ����*/
function ShowEdges()
{
	var visual = deloneArray[visualDeloneCount];
	if(visual.edge1 != null)
	{
		visual.edge1.show();
	}
	if(visual.edge2 !=null)
	{
		visual.edge2.show();
	}	
	setTimeout(NewIteration, 500);
}

/*������ ����� ��������*/
function NewIteration()
{
	deloneArray[visualDeloneCount].bubbles[bubbleCount-1].hide();
	deloneArray[visualDeloneCount].baseEdgeLine.hide();
	visualDeloneCount++;
	bubbleCount = 0;
	setTimeout(VisualDelone, 500);
}