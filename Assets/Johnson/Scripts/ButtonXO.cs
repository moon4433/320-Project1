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
    public Image image;

    public void Init(GridPOS pos, UnityAction callback)
    {
        this.pos = pos;

        Button bttn = GetComponent<Button>();

        bttn.onClick.AddListener( callback );
    }

    public void SetOwner(byte b)
    {

        if (b == 0) Destroy(image.gameObject);
        if (b == 1) image.color = UnityEngine.Color.red;
        if (b == 2) image.color = UnityEngine.Color.black;
    }
}
