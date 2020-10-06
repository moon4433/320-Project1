﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using System.Net;
using System.Net.Sockets;
using TMPro;
using System;

public class ControllerGameClient : MonoBehaviour
{

    static ControllerGameClient singleton;

    TcpClient socket = new TcpClient();

    Buffer buffer = Buffer.Alloc(0);

    public TMP_InputField inputHost;
    public TMP_InputField inputPort;

    public Transform panelHostDetails;
    public Transform panelUsername;
    public Transform panelGameplay;


    // Start is called before the first frame update
    void Start()
    {
        if (singleton)
        {
            // already set...
            Destroy(gameObject); // there's already one out there.....
        }
        else
        {
            singleton = this;
            DontDestroyOnLoad(gameObject); // dont destroy when loading new scenes!
        }


        // Buffer buff = Buffer.Alloc(4);
        // buff.Concat(new byte[] { 1, 2, 3, 4 },-1);
        // buff.Consume(3);
        // print(buff);
    }

    public void OnButtonConnect()
    {
        string host = inputHost.text;
        UInt16.TryParse(inputPort.text, out ushort port);

        TryToConnect(host, port);
    }

    async public void TryToConnect(string host, int port)
    {
        if (socket.Connected) return; // already connected to a server, cancel....

        try
        {
            await socket.ConnectAsync(host, port);

            StartReceivingPackets();
        }
        catch(Exception e)
        {
            print("FAILED TO CONNECT...");

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

        string packetIdentifier = buffer.ReadString(0, 4);

        switch(packetIdentifier){
            case "JOIN":
                if (buffer.Length < 5) return; // not enough data for a JOIN packet
                byte joinResponse = buffer.ReadUInt8(4);

                if (joinResponse == 1 || joinResponse == 2 || joinResponse == 3)
                {
                    panelHostDetails.gameObject.SetActive(false);
                    panelUsername.gameObject.SetActive(false);
                    panelGameplay.gameObject.SetActive(true);
                }
                else
                {
                    // TODO: show error message to user

                    panelHostDetails.gameObject.SetActive(false);
                    panelUsername.gameObject.SetActive(true);
                    panelGameplay.gameObject.SetActive(false);
                }

                buffer.Consume(5);

                break;
            case "UPDT":

                if (buffer.Length < 15) return; // not enough data for a UPDT packet
                byte whoseTurn = buffer.ReadUInt8(4);
                byte gameStatus = buffer.ReadUInt8(5);

                byte[] spaces = new byte[9];
                for(int i = 0; i < 9; i++)
                {
                    spaces[i] = buffer.ReadUInt8(6 + 1);
                }

                // switch to gameplay screen...

                panelHostDetails.gameObject.SetActive(false);
                panelUsername.gameObject.SetActive(false);
                panelGameplay.gameObject.SetActive(true);

                //TODO: update all of the interface to reflect game state:
                // - whose turn
                // - 9 spaces on board
                // - status
                // TODO: consume data from buffer
                buffer.Consume(15);
                break;
            case "CHAT":

                byte usernameLength = buffer.ReadByte(4);
                ushort messageLength = buffer.ReadUInt16BE(5);

                int fullPacketLength = 7 + usernameLength + messageLength;

                if (buffer.Length < fullPacketLength) return;

                string username = buffer.ReadString(7, usernameLength);
                string message = buffer.ReadString(7 + usernameLength, messageLength);
                
                // switch to gameplay screen...         
                panelHostDetails.gameObject.SetActive(false);
                panelUsername.gameObject.SetActive(false);
                panelGameplay.gameObject.SetActive(true);

                // TODO: update chat view...
                buffer.Consume(fullPacketLength);
                break;
            default:
                print("unkown packet identifier...");

                // TODO: clear buffer... 
                // TODO: consume data from buffer
                buffer.Clear();

                break;
        }
    }
}
