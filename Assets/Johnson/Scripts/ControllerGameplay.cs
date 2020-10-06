using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;



public enum Player
{
    Nobody,
    PlayerX,
    PlayerO
}

public class ControllerGameplay : MonoBehaviour
{

    private int colums = 8;
    private int rows = 8;

    public ButtonRB bttnPrefab;

    private Player whoseTurn = Player.PlayerX;
    private Player[,] boardData; // all the data of who owns what
    private ButtonRB[,] boardUI; // all the buttons

    public Transform panelGameBoard; // grid of buttons


    // Start is called before the first frame update
    void Start()
    {
        buildBoardUI();
    }

    private void buildBoardUI()
    {

        boardUI = new ButtonRB[colums, rows]; // instantiating array for buttons


        for (int x = 0; x < colums; x++)
        {
            for(int y =0; y < rows; y++)
            {
                ButtonRB bttn = Instantiate(bttnPrefab, panelGameBoard);
                bttn.Init(new GridPOS(x,y), ()=> { ButtonClicked(bttn); });
                boardUI[x, y] = bttn;
            }
        }
        


    }

    void ButtonClicked(ButtonRB bttn)
    {
        print($"a button was clicked {bttn.pos}");
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
