using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;


public struct GridPOS
{
    public int X;
    public int Y;
    public GridPOS(int X, int Y)
    {
        this.X = X;
        this.Y = Y;
    }
    public override string ToString()
    {
        return $"Grid Position: ({X}, {Y})";
    }
}

public class ButtonXO : MonoBehaviour
{

    public GridPOS pos;
    public Sprite emptySpace;
    public Sprite blackSpace;
    public Sprite redSpace;

    private Button bttn;
    public Image image;

    [HideInInspector]
    public int isKingged = 0;
    
    public void Init(GridPOS pos, UnityAction callback)
    {
        this.pos = pos;

        bttn = GetComponent<Button>();
        isKingged = 1;
        bttn.onClick.AddListener( callback );
    }

    

    public void SetOwner(byte b)
    {
        if (b == 0) image.sprite = emptySpace;
        if (b == 1) image.sprite = blackSpace;
        if (b == 2) image.sprite = redSpace;
    }
}
