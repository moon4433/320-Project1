using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net;
using System.Net.Sockets;
using TMPro;
using System;
using System.Text.RegularExpressions;
using System.Runtime.CompilerServices;

public enum Panel
{
    Host,
    Username,
    Gameplay,
    GameOver
}
public class ControllerGameClient : MonoBehaviour
{

    static public ControllerGameClient singleton;

    TcpClient socket = new TcpClient();

    Buffer buffer = Buffer.Alloc(0);

    public TMP_InputField inputHost;
    public TMP_InputField inputPort;
    public TMP_InputField inputUsername;

    public TextMeshProUGUI errorTxt;

    public Transform panelHostDetails;
    public Transform panelUsername;
    public ControllerGameplay panelGameplay;
    
    [HideInInspector]
    public int playerTurn = 0;


    // Start is called before the first frame update
    void Start()
    {
        panelGameplay.GetComponent<ControllerGameplay>();
        if (singleton)
        {
            // already set...
            Destroy(gameObject); // there's already one out there.....
        }
        else
        {
            singleton = this;
            DontDestroyOnLoad(gameObject); // dont destroy when loading new scenes!

            // show connection screen:
            panelHostDetails.gameObject.SetActive(true);
            panelUsername.gameObject.SetActive(false);
            panelGameplay.gameObject.SetActive(false);

        }


        // Buffer buff = Buffer.Alloc(4);
        // buff.Concat(new byte[] { 1, 2, 3, 4 },-1);
        // buff.Consume(3);
        // print(buff);
    }

    public void SwitchToPanel(Panel panel)
    {
        switch (panel)
        {
            case Panel.Host:
                panelHostDetails.gameObject.SetActive(true);
                panelUsername.gameObject.SetActive(false);
                panelGameplay.gameObject.SetActive(false);
                //panelGameOver.gameObject.SetActive(false);
                break;
            case Panel.Username:
                panelHostDetails.gameObject.SetActive(false);
                panelUsername.gameObject.SetActive(true);
                panelGameplay.gameObject.SetActive(false);
                //panelGameOver.gameObject.SetActive(false);
                break;
            case Panel.Gameplay:
                panelHostDetails.gameObject.SetActive(false);
                panelUsername.gameObject.SetActive(false);
                panelGameplay.gameObject.SetActive(true);
                //panelGameOver.gameObject.SetActive(false);
                
                break;
            case Panel.GameOver:
                panelHostDetails.gameObject.SetActive(false);
                panelUsername.gameObject.SetActive(false);
                panelGameplay.gameObject.SetActive(false);
                //panelGameOver.gameObject.SetActive(true);
                break;
            default:
                break;
        }
    }

    public void OnButtonConnect()
    {
        string host = inputHost.text;
        UInt16.TryParse(inputPort.text, out ushort port);

        TryToConnect(host, port);
    }

    public void OnButtonUsername()
    {
        string user = inputUsername.text;
        Buffer packet = PacketBuilder.Join(inputUsername.text);
        SendPacketToServer(packet);
        
    }

    async public void TryToConnect(string host, int port)
    {
        if (socket.Connected) return; // already connected to a server, cancel....

        try
        {
            await socket.ConnectAsync(host, port);

            // switch to ""username" screenw

            errorTxt.gameObject.SetActive(false);
            SwitchToPanel(Panel.Username);

            StartReceivingPackets();
        }
        catch(Exception e)
        {
            print("FAILED TO CONNECT...");
            errorTxt.gameObject.SetActive(true);
            errorTxt.text = "Could not connect to server due to an unkown error";
            SwitchToPanel(Panel.Host);
        }
    }

    async private void StartReceivingPackets()
    {

        int maxPacketSize = 4096;

        while (socket.Connected)
        {

            byte[] data = new byte[maxPacketSize];

            try
            {
                int bytesRead = await socket.GetStream().ReadAsync(data, 0, maxPacketSize);

                buffer.Concat(data, bytesRead);

                ProcessPacket();
            }
            catch(Exception e)
            {

            }

        }
    }

    void ProcessPacket()
    {
        if (buffer.Length < 4) return; // not enough data in buffer

        print(buffer.ReadString(0, buffer.Length).ToString());
        //print(buffer.ReadString(0, 4).ToString());

        string packetIdentifier = buffer.ReadString(0, 4);

        switch(packetIdentifier){
            case "JOIN":
                if (buffer.Length < 70) return; // not enough data for a JOIN packet
                byte joinResponse = buffer.ReadUInt8(4);
                byte currentPlayerTurn = buffer.ReadUInt8(5);
                playerTurn = currentPlayerTurn;
                byte[] currentSpaces = new byte[64];
                for (int i = 0; i < 64; i++)
                {
                    currentSpaces[i] = buffer.ReadUInt8(6 + i);
                }

                if (joinResponse == 1 || joinResponse == 2 || joinResponse == 3)
                {
                    errorTxt.gameObject.SetActive(false);

                    SwitchToPanel(Panel.Gameplay);
                }
                else if (joinResponse == 4)
                {
                    errorTxt.text = "Username too short";
                    errorTxt.gameObject.SetActive(true);
                    SwitchToPanel(Panel.Username);
                }
                else if (joinResponse == 5)
                {
                    errorTxt.text = "Username too long";
                    errorTxt.gameObject.SetActive(true);
                    SwitchToPanel(Panel.Username);
                }
                else if (joinResponse == 6)
                {
                    errorTxt.text = "Username cannot contain special characters";
                    errorTxt.gameObject.SetActive(true);
                    SwitchToPanel(Panel.Username);
                }
                else if (joinResponse == 7)
                {
                    errorTxt.text = "Username already in use";
                    errorTxt.gameObject.SetActive(true);
                    SwitchToPanel(Panel.Username);
                }
                else if (joinResponse == 8)
                {
                    errorTxt.text = "Username contains profanity";
                    errorTxt.gameObject.SetActive(true);
                    SwitchToPanel(Panel.Username);
                }
                else if(joinResponse == 9)
                { // server full, send to first screen
                    errorTxt.gameObject.SetActive(true);
                    SwitchToPanel(Panel.Host);
                }
                else
                {
                    // username denied!

                    SwitchToPanel(Panel.Host);
                    inputUsername.text = "";
                    // TODO: show error message to user
                    errorTxt.gameObject.SetActive(true);
                    errorTxt.text = "Could not connect to server due to an unkown error";
                    print(joinResponse);
                }

                panelGameplay.SetTheBoard(currentSpaces);

                buffer.Consume(70);
                
                break;
            case "NVLD":

                ushort notValidMsgLenght = buffer.ReadUInt16BE(4);
                int pL = 5 + notValidMsgLenght;

                if (buffer.Length < pL) return;

                string nVM = buffer.ReadString(6, notValidMsgLenght);

                print("Console: " + nVM);

                panelGameplay.AddMessageToChatDisplay("Console: " , nVM);

                buffer.Consume(pL);

                break;

            case "CHAT":


                byte usernameLength = buffer.ReadUInt8(4);
                ushort messageLength = buffer.ReadUInt16BE(5);

                int fullPacketLength = 7 + usernameLength + messageLength;
               
                if (buffer.Length < fullPacketLength) return;

                // switch to gameplay screen...         
                SwitchToPanel(Panel.Gameplay);

                string username = buffer.ReadString(7, usernameLength);
                string message = buffer.ReadString(7 + usernameLength, messageLength);

                print(username + ": " + message);

                panelGameplay.AddMessageToChatDisplay(username, message);
                
                buffer.Consume(fullPacketLength);
                break;
            case "UPDT":

                if (buffer.Length < 70) return; // not enough data for a UPDT packet

                // switch to gameplay screen...

                SwitchToPanel(Panel.Gameplay);

                byte whoseTurn = buffer.ReadUInt8(4);
                playerTurn = whoseTurn;
                byte gameStatus = buffer.ReadUInt8(5);
                /*if(gameStatus != 0)
                {
                    switch (gameStatus)
                    {
                        case 1:
                            break;
                        case 2:
                            break;
                        default:
                            break;
                    }
                }*/

                byte[] spaces = new byte[64];
                for(int i = 0; i < 64; i++)
                {
                    spaces[i] = buffer.ReadUInt8(6 + i);
                }

                

                panelGameplay.UpdateFromServer(gameStatus, whoseTurn, spaces);        

                // consume data from buffer
                buffer.Consume(70);
                
                break;
            default:
                print("unkown packet identifier...");

                // TODO: clear buffer... 
                // TODO: consume data from buffer
                buffer.Clear();

                break;
        }
    }

    async public void SendPacketToServer(Buffer packet)
    {
        if (!socket.Connected) return; // not connected to the server...

        await socket.GetStream().WriteAsync(packet.bytes, 0, packet.bytes.Length);


    }

    public void SendMoveCheck(int x, int y, int isKinged)
    {
        SendPacketToServer(PacketBuilder.MVCH(x, y, isKinged));
    }

    public void SendChatPacket(string msg)
    {
        SendPacketToServer(PacketBuilder.Chat(msg));
    }
    public void SendPlayPacket(int x, int y)
    {
        SendPacketToServer( PacketBuilder.Play(x, y) );
    }
}
