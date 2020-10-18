using System;
using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using TMPro;
using UnityEngine;
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

    public ButtonXO bttnPrefab;

    public TMP_InputField chatInput;
    public TextMeshProUGUI chatDisplay;
    public ScrollRect scrollRect;

    private Player whoseTurn = Player.PlayerBlack;
    private Player[,] boardData; // all the data of who owns what
    private ButtonXO[,] boardUI; // all the buttons

    public Transform panelGameBoard; // grid of buttons


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
}
