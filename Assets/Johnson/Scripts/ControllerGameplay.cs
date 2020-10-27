using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text.RegularExpressions;
using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.EventSystems;
using UnityEngine.UI;

public enum Player
{
    Nobody,
    PlayerBlack,
    PlayerRed
}

public class ControllerGameplay : MonoBehaviour
{

    private int colums = 8;
    private int rows = 8;

    string console = "Console";
    

    public ButtonXO bttnPrefab;
    [HideInInspector]
    public ButtonXO previousBttn;

    public Sprite emptySpace;
    public Sprite blackSpace;
    public Sprite redSpace;

    public TMP_InputField chatInput;
    public TextMeshProUGUI chatDisplay;
    public ScrollRect scrollRect;

    private Player whoseTurn = Player.PlayerBlack;
    private Player[,] boardData; // all the data of who owns what
    private ButtonXO[,] boardUI; // all the buttons
    private ButtonXO selectedButton;


    public Transform panelGameBoard; // grid of buttons

    public ControllerGameClient client;
    [HideInInspector]
    public bool hasButtonBeenPicked;

    public UnityAction callback;


    // Start is called before the first frame update
    void Start()
    {
        buildBoardUI();
        scrollRect.GetComponent<ScrollRect>();
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
        ButtonXO tl = boardUI[bttn.pos.X - 1, bttn.pos.Y - 1];
        ButtonXO tr = boardUI[bttn.pos.X - 1, bttn.pos.Y + 1];
        ButtonXO bl = boardUI[bttn.pos.X + 1, bttn.pos.Y - 1];
        ButtonXO br = boardUI[bttn.pos.X + 1, bttn.pos.Y + 1];

        if (!hasButtonBeenPicked)
        {
            //ControllerGameClient.singleton.SendPlayPacket(bttn.pos.X, bttn.pos.Y);
            ControllerGameClient.singleton.SendMoveCheck(bttn.pos.X, bttn.pos.Y, bttn.isKingged);
            previousBttn = boardUI[bttn.pos.X, bttn.pos.Y];
            SetSelected(previousBttn.GetComponent<Button>());
            hasButtonBeenPicked = true;
        }
        else
        {
            SetUnSelected(tl.GetComponent<Button>());
            SetUnSelected(tr.GetComponent<Button>());
            SetUnSelected(bl.GetComponent<Button>());
            SetUnSelected(br.GetComponent<Button>());
            SetUnSelected(previousBttn.GetComponent<Button>());
            hasButtonBeenPicked = true;
        }
            

    }


    int CheckForPlayerPuck(ButtonXO bttn)
    {
        int isPlayerPuckHere = 0;

        if(boardUI[bttn.pos.X, bttn.pos.Y].image.sprite == emptySpace)
        {
            
            return isPlayerPuckHere = 0;
        }
        if (boardUI[bttn.pos.X, bttn.pos.Y].image.sprite == blackSpace)
        {
            
            return isPlayerPuckHere = 1;
        }
        if (boardUI[bttn.pos.X, bttn.pos.Y].image.sprite == redSpace)
        {
            
            return isPlayerPuckHere = 2;
        }

        return isPlayerPuckHere;
    }

    public void ShowValidMoves(byte tlY, byte tlX, byte trY, byte trX, byte blY, byte blX, byte brY, byte brX)
    {
        hasButtonBeenPicked = true;

        if (tlY == 0)
        {
            tlY -= 1;
        }
        if (tlX == 0)
        {
            tlX -= 1;
        }
        if (trY == 0)
        {
            trY -= 1;
        }
        if (trX == 0)
        {
            trX -= 1;
        }
        if (blY == 0)
        {
            blY -= 1;
        }
        if (blX == 0)
        {
            blX -= 1;
        }
        if (brY == 0)
        {
            brY -= 1;
        }
        if (brX == 0)
        {
            brX -= 1;
        }

        
        NextPlayTileColor(boardUI[tlX, tlY].GetComponent<Button>());
        NextPlayTileColor(boardUI[trX, trY].GetComponent<Button>());
        NextPlayTileColor(boardUI[blX, blY].GetComponent<Button>());
        NextPlayTileColor(boardUI[brX, brY].GetComponent<Button>());

        print("tlX: " + (tlX) + " tlY: " + (tlY) + " tlrX: " + (trX) + " trY: " + (trY) + " blX: " + (blX) + " blY: " + (blY) + " brX: " + (brX) + " brY: " + (brY));

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

            int x = i % 8;
            int y = i / 8;

            boardUI[x, y].SetOwner(b);
        }

    }

    public void SetTheBoard(byte[] spaces)
    {
        //TODO: update all of the interface to reflect game state:
        // - whose turn
        // - 64 spaces on board
        // - status

        for (int i = 0; i < spaces.Length; i++)
        {
            byte b = spaces[i];

            int x = i % 8;
            int y = i / 8;

            boardUI[x, y].SetOwner(b);
        }

    }

    public void UserDoneEditingMessage()
    {
        string txt = chatInput.text;

        if (!new Regex(@"^(\s|\t)*$").IsMatch(txt))
        {
            ControllerGameClient.singleton.SendChatPacket(txt);
            chatInput.text = "";
        }


        chatInput.Select();
        chatInput.ActivateInputField();
    }

    public void AddMessageToChatDisplay(string user, string msg)
    {
        chatDisplay.text += ($"{user}: {msg}\n");
        scrollRect.velocity = new Vector2(0f, 500f);
    }

    public void AddMessageToUserDisplay(string users)
    {
        chatDisplay.text += ($"{users}\n");
    }

    public void SetSelected(Button button)
    {
        ColorBlock cb = button.colors;
        cb.normalColor = Color.yellow;
        cb.highlightedColor = Color.yellow;
        cb.selectedColor = Color.yellow;
        button.colors = cb;
    }

    public void NextPlayTileColor(Button button)
    {
        ColorBlock cb = button.colors;
        cb.normalColor = Color.cyan;
        cb.highlightedColor = Color.cyan;
        cb.selectedColor = Color.cyan;
        button.colors = cb;
    }

    public void SetUnSelected(Button button)
    {
        ColorBlock cb = button.colors;
        cb.normalColor = Color.white;
        cb.selectedColor = Color.white;
        cb.highlightedColor = Color.white;
        button.colors = cb;
    }
}
