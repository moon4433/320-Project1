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

    public ButtonXO bttnPrefab;

    private Player whoseTurn = Player.PlayerX;
    private Player[,] boardData; // all the data of who owns what
    private ButtonXO[,] boardUI; // all the buttons

    public Transform panelGameBoard; // grid of buttons


    // Start is called before the first frame update
    void Start()
    {
        buildBoardUI();
    }

    private void buildBoardUI()
    {

        boardUI = new ButtonXO[colums, rows]; // instantiating array for buttons


        for (int x = 0; x < colums; x++)
        {
            for(int y =0; y < rows; y++)
            {
                ButtonXO bttn = Instantiate(bttnPrefab, panelGameBoard);
                bttn.Init(new GridPOS(x,y), ()=> { ButtonClicked(bttn); });
                boardUI[x, y] = bttn;
            }
        }
        


    }

    void ButtonClicked(ButtonXO bttn)
    {
        ControllerGameClient.singleton.SendPlayPacket(bttn.pos.X, bttn.pos.Y);
    }

    public void UpdateFromServer(byte gameStatus, byte whoseTurn, byte[] spaces)
    {
        //TODO: update all of the interface to reflect game state:
        // - whose turn
        // - 64 spaces on board
        // - status

        for(int i = 0; i < spaces.Length; i++)
        {
            byte b = spaces[i];

            int x = i % 3;
            int y = i / 3;

            boardUI[x, y].SetOwner(b);
        }

    }
}
