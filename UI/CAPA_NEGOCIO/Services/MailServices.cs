﻿using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace CAPA_NEGOCIO.Services
{
    public class MailServices
    {
        public static bool SendMail(string body, List<String> toMails, String from, String subject)
        {
            try
            {
                MailMessage correo = new MailMessage();
                correo.From = new MailAddress("iris@softcode.es", "wilber", System.Text.Encoding.UTF8);//Correo de salida
                foreach (String toMail in toMails)
                {
                    correo.To.Add(toMail); //Correo destino?
                }
                correo.Subject = subject; //Asunto
                correo.Body = @" <div role='article' style='width:100%'>
                    <div style='font-family:  sans-serif !important;
                    color: #444444 !important;
                    display: block !important;
                    width: 100% !important;
                    height: 100% !important;
                    overflow: hidden !important;
                    font-weight: 400 !important;
                    background: #f2f2f2 !important;' class='mail-container'>       
                        <div style='border-radius: 0.8cm !important;
                        overflow: hidden !important;
                        width: 700px !important;
                        height: auto !important;
                        background-color: #fff !important;
                        display: block !important;               
                        padding: 0 !important;
                        margin: 40px auto !important;
                        position: relative !important;
                        
                        box-shadow: 0 0 5px 0 #999999 !important;' class='main-contain'>
                            <div style='display: block !important;
                            text-align: center !important;' class='header'>
                                <img style='height: 80px !important;
                                    margin: 20px !important;
                                    margin-left: 30px !important;' class='logo'
                                    src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMyIiBoZWlnaHQ9IjU5IiB2aWV3Qm94PSIwIDAgMTMyIDU5IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPHBhdGggZD0iTTEzMS45MDUgMzkuNTM0M0wxMTYuNTU4IDI4Ljg1MjVMMTAxLjc0IDQwLjI4MDRMMTA3LjkzNiA1OC4wMjhMMTI2LjU3OSA1Ny41NzE0TDEzMS45MDUgMzkuNTM0M1oiIGZpbGw9IiMzN0EzQjYiLz4NCjxwYXRoIGQ9Ik0xMjguNTUyIDQwLjUwMThDMTI4LjU1MiA0Mi42MTE4IDEyOC4xNCA0NC43MDExIDEyNy4zMzkgNDYuNjUwNEMxMjYuNTM5IDQ4LjU5OTggMTI1LjM2NiA1MC4zNzEgMTIzLjg4NyA1MS44NjNDMTIyLjQwOCA1My4zNTUgMTIwLjY1MiA1NC41Mzg1IDExOC43MiA1NS4zNDZDMTE2Ljc4OCA1Ni4xNTM0IDExNC43MTYgNTYuNTY5IDExMi42MjUgNTYuNTY5QzEwOC40MDEgNTYuNTY5IDEwNC4zNSA1NC44NzYyIDEwMS4zNjMgNTEuODYzQzk4LjM3NiA0OC44NDk4IDk2LjY5OCA0NC43NjMxIDk2LjY5OCA0MC41MDE4Qzk2LjY5OCAzNi4yNDA1IDk4LjM3NiAzMi4xNTM3IDEwMS4zNjMgMjkuMTQwNkMxMDQuMzUgMjYuMTI3NCAxMDguNDAxIDI0LjQzNDYgMTEyLjYyNSAyNC40MzQ2QzExNC43MTYgMjQuNDM0NiAxMTYuNzg4IDI0Ljg1MDIgMTE4LjcyIDI1LjY1NzZDMTIwLjY1MiAyNi40NjUxIDEyMi40MDggMjcuNjQ4NiAxMjMuODg3IDI5LjE0MDVDMTI1LjM2NiAzMC42MzI1IDEyNi41MzkgMzIuNDAzOCAxMjcuMzM5IDM0LjM1MzFDMTI4LjE0IDM2LjMwMjUgMTI4LjU1MiAzOC4zOTE4IDEyOC41NTIgNDAuNTAxOFY0MC41MDE4WiIgZmlsbD0idXJsKCNwYWludDBfcmFkaWFsXzk4OV8zMjgxKSIvPg0KPHBhdGggZD0iTTExNi41MDIgMjguNzA0MUwxMDEuNzEyIDQwLjE2MDdMMTAzLjgwMyA0Ni4xMjMzQzEwNC40MDkgNDUuNTAzMyAxMDUuNjM3IDQ0LjI0NTQgMTA1LjY2MSA0NC4yMjI2QzEwOS44MyA0MC4yODQyIDExMi4yOTkgNDEuMDAzMSAxMTQuOTI3IDQyLjEzOTVDMTE3LjU0MSA0My4yNjk2IDExOS4xNzQgNDQuMjcxNyAxMjEuNjY0IDQ0Ljg5OTVDMTI0LjE1MyA0NS41Mjc0IDEyNy4yNzEgNDUuMjc2MiAxMjguMTQyIDQ0Ljg5OTVDMTI4LjkyNyA0NC41NjAzIDEzMC4xNyA0NC4zNDQ2IDEzMC40MzkgNDQuMzAwN0wxMzEuODg1IDM5LjM1MzVMMTE2LjUwMiAyOC43MDQxWiIgZmlsbD0iIzJCOUVCQSIgZmlsbC1vcGFjaXR5PSIwLjU4MzY5MSIvPg0KPHBhdGggZD0iTTEzMS44ODQgMzkuMzUxNEwxMTYuNTExIDI4LjcwOEwxMDEuNzIxIDQwLjE3MjhMMTA3Ljk2MSA1Ny45MDQ4TDEyNi42MDIgNTcuNDAxOEwxMzEuODg0IDM5LjM1MTRaTTEyOC41NjYgNDAuNDY4OEwxMjQuMTU2IDU0Ljg1NTJMMTA5LjU2OCA1NS41NDg2TDEwNC45NjYgNDEuNTk3MkwxMTYuNzAyIDMyLjI3NjhMMTI4LjU2NiA0MC40Njg4VjQwLjQ2ODhaIiBmaWxsPSJ1cmwoI3BhaW50MV9saW5lYXJfOTg5XzMyODEpIi8+DQo8cGF0aCBkPSJNMy41NTI0IDU3Ljk3NjJDMS40MTY4NiA1Ny42Mzg0IDAuMjE4ODUgNTYuNTc5MiAwLjIxNjMxNSA1NS4wMjdDMC4yMTQ2NjMgNTQuMDU3IDAuNTM3ODM3IDUzLjU2OTEgMS42ODgyMyA1Mi44MDQ4QzEuNzA1IDUyLjc5NCAxLjU4MTExIDUyLjU4NzYgMS40MTI4OSA1Mi4zNDY4QzEuMDQ1NjUgNTEuODIxMiAwLjkyNDM4NSA1MS4wNzM5IDEuMTEyODcgNTAuNDk3N0MxLjE4NDE1IDUwLjI3OTggMS40NTMzIDQ5LjkwMTQgMS43MzEyMSA0OS42MjgzTDIuMjIzMzIgNDkuMTQ0OEwxLjg1NDk0IDQ4LjczMzRDMS42NTIzMyA0OC41MDcyIDEuMzcwNDUgNDguMDY4MSAxLjIyODU0IDQ3Ljc1NzZDMS4wMDE3MyA0Ny4yNjE0IDAuOTY5OTc5IDQ3LjA1OTYgMC45NjU5NzMgNDYuMDg5M0MwLjk2MTg0NCA0NS4wOTEgMC45ODc0MzEgNDQuOTI5NCAxLjIzMzM1IDQ0LjM5OThDMS43NzAwOCA0My4yNDQgMi41MDk4MiA0Mi41OTI2IDMuNzIxOTYgNDIuMjA4M0M0LjI4ODcxIDQyLjAyODcgNC42MjM4NCA0Mi4wMTIyIDcuNTI0NzQgNDIuMDIxM0M5LjI3NDQzIDQyLjAyOTYgMTAuNzQyNiA0Mi4wNjc5IDEwLjc4NzQgNDIuMTEzNEMxMC44MzIxIDQyLjE1ODQgMTAuODU1NCA0Mi41MDcyIDEwLjgzOSA0Mi44ODhMMTAuODA5MyA0My41ODA1SDEwLjQ2MTFDMTAuMjY5NiA0My41ODA1IDkuNzY4OTIgNDMuNTQwNSA5LjM0ODQzIDQzLjQ5NzJMOC41ODM5MiA0My40MThMOS4wMTMxNCA0NC4yNTk1QzkuNTE4MTEgNDUuMjQ5NSA5LjY0MDI5IDQ1Ljk3NjYgOS40NjU3OCA0Ni45NTNDOS4yMjk2NSA0OC4yNzQxIDguNDQwNTggNDkuMjk1MyA3LjE5NjM0IDQ5Ljg4OTlDNi41NDQ4IDUwLjIwMTMgNi41MDI5NiA1MC4yMDc2IDUuMDM5NzkgNTAuMjEzNUMzLjc4MzI1IDUwLjIyMTggMy41MDUxMiA1MC4yNDc2IDMuMjc4MDQgNTAuMzk4MUMyLjc2MjIgNTAuNzM5NyAyLjgzMzkzIDUxLjI2MTEgMy40MjI1OSA1MS40NDg4QzMuODgzMjQgNTEuNTk1OCA0LjIzNDgxIDUxLjY0NDMgNi4wNzUyMSA1MS44MTVDOC44NTEzNSA1Mi4wNzI1IDkuOTA1NjUgNTIuNTAwNSAxMC40ODkxIDUzLjYwN0MxMC44MDEyIDU0LjE5ODcgMTAuODAyIDU1LjU0NzQgMTAuNDkwOCA1Ni4xMzc3QzEwLjA5MjggNTYuODkyMiA5LjIwNTA5IDU3LjUwMDcgOC4wMTg3MiA1Ny44MzI0QzcuMzEzODMgNTguMDI5NCA0LjQ2MTIgNTguMTIzOCAzLjU1MjUyIDU3Ljk4MDFMMy41NTI0IDU3Ljk3NjJaTTcuMzc3NDQgNTYuMjIxNkM4LjQ0MTI4IDU1Ljg5NzYgOC45NTI3NSA1NS4zODAxIDguODE4NTEgNTQuNzYzNkM4LjY2MzQ5IDU0LjA1MTUgNy40MDYwMiA1My42NzQyIDQuNjE4NTYgNTMuNTAzNUMzLjU1NzgxIDUzLjQzODUgMy41MTk5NSA1My40NDM1IDMuMDY4NzMgNTMuNzEwM0MxLjQ2ODkyIDU0LjY1NjEgMS45Mzg0IDU2LjAwMyAzLjk5NTMzIDU2LjM2ODVDNC43NzE3NSA1Ni41MDY1IDYuNzE5NjggNTYuNDIxOCA3LjM3NzQ0IDU2LjIyMTZaTTYuNDUxNTUgNDguMzYzMUM3LjIwNTEzIDQ3Ljk3NDkgNy41NzYzOSA0Ny4yNTY4IDcuNTc2MzkgNDYuMTg3M0M3LjU3NjM5IDQ1LjA0MTYgNy4xNjUgNDQuMjg3OCA2LjMwOTI5IDQzLjg2NTVDNS4zMjQ0NSA0My4zNzk0IDQuMjEzMTYgNDMuNTg3NSAzLjUxMzg2IDQ0LjM4OUMzLjA1OTI5IDQ0LjkwOTkgMi45MDAzOSA0NS4zOTQ2IDIuOTAzMzEgNDYuMjUxNEMyLjkwNjYxIDQ3LjMwMzcgMy40NTEwNiA0OC4xNDk5IDQuMzQ1NDEgNDguNDk0QzQuODkxMDkgNDguNzAzOSA1LjkxMzIgNDguNjQwNCA2LjQ1MTU1IDQ4LjM2MzFaTTMxLjE5ODkgNTcuNjU4NUMzMS4xNzE5IDU3LjU4NzcgMzEuMTYxNSA1NC4wOTcyIDMxLjE3NTYgNDkuOTAyNUwzMS4yMDEzIDQyLjI3NTlIMzIuMDQ2OEgzMi44OTIzTDMyLjkyMTMgNDIuOTkzMUwzMi45NTAzIDQzLjcxMDJMMzMuNDU5NSA0My4xNjcxQzMzLjc2NTMgNDIuODQwOCAzNC4yMTY3IDQyLjUwMDggMzQuNTg5OSA0Mi4zMTU0QzM1LjE1MTQgNDIuMDM2NiAzNS4zMDA2IDQyLjAwNzIgMzYuMTQwNiA0Mi4wMDk5QzM3LjIwODIgNDIuMDA5OSAzNy44MDQ5IDQyLjE2OTIgMzguNTE2OSA0Mi42M0MzOS41MTg3IDQzLjI3ODYgNDAuMjUyOCA0NC41MDE3IDQwLjU1NzEgNDYuMDI5M0M0MC44MDk2IDQ3LjI5NjYgNDAuNzE5NyA0OS40MTY3IDQwLjM2NzEgNTAuNTEyNUMzOS43NDk0IDUyLjQzMiAzOC40NjEzIDUzLjY1NDEgMzYuODQzNiA1My44NTU0QzM1LjQ3OTIgNTQuMDI1MyAzNC4yMzUyIDUzLjY2NTcgMzMuNDUxMiA1Mi44NzQ4TDMzLjA0NDggNTIuNDY0OEwzMy4wMTgyIDU1LjA5NzNMMzIuOTkxNyA1Ny43Mjk4TDMyLjExOTcgNTcuNzU5QzMxLjQ3ODEgNTcuNzgwNyAzMS4yMzQ4IDU3Ljc1MDcgMzEuMTk4NyA1Ny42NTg3TDMxLjE5ODkgNTcuNjU4NVpNMzYuOTQzOCA1MS45ODlDMzguMjg3NiA1MS40NDY1IDM5LjAyMzMgNDkuMDA0OSAzOC41NjczIDQ2LjYwMDRDMzguMzA1NCA0NS4yMTk5IDM3Ljc0MjEgNDQuMzMwMiAzNi44NzEzIDQzLjkyMkMzNi4zODgyIDQzLjY5NTUgMzUuNDYxNCA0My42NzI3IDM0Ljk4MDIgNDMuODc1M0MzNC40MTY3IDQ0LjExMjggMzMuNjkyOSA0NC44NzU1IDMzLjM3NzggNDUuNTYzOEMzMy4wOTc0IDQ2LjE3NiAzMy4wOTE0IDQ2LjIyNTggMzMuMDkzIDQ3Ljg5NTRDMzMuMDk0NiA0OS40MzY3IDMzLjExNjYgNDkuNjU2NCAzMy4zMjIxIDUwLjE3MzRDMzMuNTc0NSA1MC44MDgxIDM0LjI5MjQgNTEuNjc5IDM0Ljc3MDQgNTEuOTMwMkMzNS40NDI4IDUyLjI4MzcgMzYuMTY1IDUyLjMwMzIgMzYuOTQzOCA1MS45ODg2VjUxLjk4OVpNMjMuMzU5IDUzLjg1ODFDMjIuMTU4NyA1My43MjE5IDIxLjIyNzIgNTMuMDg5IDIwLjcwMzggNTIuMDU0QzIwLjI2NzcgNTEuMTkxNyAyMC4yMTMxIDUwLjU1NDggMjAuMjExMiA0Ni4zMTEzTDIwLjIwOTYgNDIuMzE4NkwyMS4xMjk3IDQyLjM0NzhMMjIuMDQ5OCA0Mi4zNzY5TDIyLjA5OTYgNDYuNDkxMkMyMi4xNDc2IDUwLjQ2NTcgMjIuMTU2NiA1MC42MTkzIDIyLjM2NCA1MS4wMDdDMjIuNjI0MSA1MS40OTMzIDIzLjA0NjEgNTEuOTEwMyAyMy40MjQxIDUyLjA1NDNDMjMuNzk4MSA1Mi4xOTY5IDI0LjYxNyA1Mi4xODk1IDI1LjEyMiA1Mi4wMzkzQzI1LjcwODQgNTEuODY0NSAyNi40ODQ1IDUxLjA1MzIgMjYuNzg0IDUwLjMwMTdDMjcuMDE2OSA0OS43MTczIDI3LjAyNCA0OS42MTM5IDI3LjA3MjkgNDYuMDQwMUwyNy4xMjMgNDIuMzc3M0gyOC4wMTgzSDI4LjkxMzVMMjguOTM5MiA0OC4wMjE5TDI4Ljk2NDkgNTMuNjY2NkgyOC4xMTg1SDI3LjI3MjJWNTIuOTQ0M1Y1Mi4yMjIxTDI2Ljc2MDQgNTIuNzQ5MkMyNi4xNzgzIDUzLjM0OSAyNS40OTcgNTMuNzM0OCAyNC44NjgyIDUzLjgyMUMyNC42MzExIDUzLjg1MzUgMjQuMzQ3NyA1My44OTI2IDI0LjIzODIgNTMuOTA4MUMyNC4xMjg4IDUzLjkyMzkgMjMuNzMzMiA1My44OTk4IDIzLjM1OSA1My44NTg5TDIzLjM1OSA1My44NTgxWk00Ny4yNjYzIDUzLjg1ODFDNDQuNDQ2MSA1My41MTMgNDIuNzQ2OSA1MS4wNDUgNDIuOTE5MSA0Ny41NDQxQzQzLjAwNTggNDUuNzgyMiA0My40NTk3IDQ0LjU3MDggNDQuNDE0NiA0My41NTIyQzQ1LjM3OTYgNDIuNTIyOSA0Ni4zODM2IDQyLjEyMjkgNDguMDAzMiA0Mi4xMjI5QzQ5LjY1NTIgNDIuMTIyOSA1MC42ODIxIDQyLjU0NDIgNTEuNjc5NiA0My42MzExQzUyLjcwNyA0NC43NTA2IDUzLjE2MjcgNDYuMTEzMSA1My4xNTU0IDQ4LjA0MzZDNTMuMTQ3OSA0OS45NzU1IDUyLjYzMzUgNTEuNDM4NSA1MS41Nzc2IDUyLjUyOTdDNTAuOTUxNyA1My4xNzY2IDQ5Ljg3OTggNTMuNzI1MSA0OS4wNzIxIDUzLjgxMTlDNDguNzYyOCA1My44NDUyIDQ4LjM3NTQgNTMuODg2OSA0OC4yMTEzIDUzLjkwNDhDNDguMDQ3MiA1My45MjIzIDQ3LjYyMTkgNTMuOTA0NyA0Ny4yNjYzIDUzLjg1ODFWNTMuODU4MVpNNDkuMzY4OSA1MS44ODk4QzUwLjIyMjEgNTEuNDIxNCA1MC43MjA0IDUwLjYzMTIgNTAuOTg4NiA0OS4zMjEzQzUxLjUyOTcgNDYuNjc4OCA1MC41NDI0IDQ0LjI2MDYgNDguNzQ0OSA0My44MjU2QzQ3LjM5OTUgNDMuNSA0Ni4wNzkxIDQ0LjE0MjEgNDUuNDI0MSA0NS40NDA0QzQ1LjE0MjkgNDUuOTk3NiA0NC44Nzg5IDQ3LjIzMzkgNDQuODc4OSA0Ny45OTM0QzQ0Ljg3ODkgNDguNzYxNyA0NS4xNDM4IDQ5Ljk5MDQgNDUuNDM0IDUwLjU2ODFDNDUuODM0MyA1MS4zNjUxIDQ2LjUzNjcgNTEuOTYzMSA0Ny4zMTYxIDUyLjE3MDVDNDcuODY3MyA1Mi4zMTcyIDQ4LjgzMDMgNTIuMTg1NSA0OS4zNjg5IDUxLjg4OThWNTEuODg5OFpNMTMuMDcxNSA0OC4wMTg1TDEzLjA5NzEgNDIuMzczOEgxMy44OTI5SDE0LjY4ODdMMTQuNzQ1NCA0My4xMjY0QzE0Ljc3NjUgNDMuNTQwMyAxNC44MTAxIDQzLjgyNTIgMTQuODIgNDMuNzU5M0MxNC44Mjk4IDQzLjY5MzUgMTUuMDg2MiA0My4zNjkgMTUuMzg5OCA0My4wMzgzQzE2LjA5MTUgNDIuMjczNiAxNi41MDcxIDQyLjEwMzQgMTcuNTc0OSA0Mi4xNDM0TDE4LjM2OTIgNDIuMTczNFY0My4wNzY1VjQzLjk3OTZMMTcuNTIyNSA0NC4wMzEzQzE2LjU2NDUgNDQuMDg5NiAxNi4yMjUgNDQuMjY0MSAxNS43MzAxIDQ0Ljk1MzNDMTUuMDIyNCA0NS45Mzg5IDE0Ljg0MjQgNDcuMTI2NSAxNC44Mzk5IDUwLjgyODdMMTQuODM4MiA1My42NjM2SDEzLjk0MjFIMTMuMDQ2TDEzLjA3MTcgNDguMDE4OUwxMy4wNzE1IDQ4LjAxODVaIiBmaWxsPSIjN0Y3RjdGIi8+DQo8cGF0aCBkPSJNNTUuMzI0IDQ3Ljc0NDhWMzcuMjA4MUg1Ny41NjIySDU5LjgwMDNWMzguMjA4NVYzOS4yMDg3TDU4LjYzMTUgMzkuMjM3MUw1Ny40NjI3IDM5LjI2NTRMNTcuNDM3MiA0Ny43N0w1Ny40MTE4IDU2LjI3NDZINTguNjA2SDU5LjgwMDNWNTcuMjc4MVY1OC4yODE2SDU3LjU2MjFINTUuMzI0VjQ3Ljc0NDlMNTUuMzI0IDQ3Ljc0NDhaTTg4Ljg0NjYgNTcuMjc4VjU2LjI3NDZIOTAuMDQwOEg5MS4yMzUxTDkxLjIwOTYgNDcuNzY5OUw5MS4xODQyIDM5LjI2NTNMOTAuMDE1NCAzOS4yMzdMODguODQ2NiAzOS4yMDg2VjM4LjIwODRWMzcuMjA4SDkxLjA4NDdIOTMuMzIyOVY0Ny43NDQ3VjU4LjI4MTVIOTEuMDg0N0g4OC44NDY2VjU3LjI3OEw4OC44NDY2IDU3LjI3OFpNODEuMDI0MiA1NC4wMTczQzgwLjIxNiA1My44NCA3OS4zNzAzIDUzLjQxMjYgNzguODgyMiA1Mi45MzQ3Qzc4LjM4MTYgNTIuNDQ0NiA3Ny45MzI3IDUxLjQ5NTggNzcuODU2NSA1MC43NjY1Qzc3LjgyNDEgNTAuNDU2OCA3Ny43NzgxIDUwLjA3OTIgNzcuNzU0MSA0OS45Mjc0TDc3LjcxMDUgNDkuNjUxNUg3OC45MDE3SDgwLjA5MjlWNTAuMDU2MUM4MC4wOTI5IDUxLjM3NDkgODEuMjM1NyA1Mi4xMjU3IDgzLjExNjMgNTIuMDQyNEM4NC42NDAzIDUxLjk3NDkgODUuMzYzOCA1MS40NTkgODUuMzY0NiA1MC40Mzk2Qzg1LjM2NTMgNDkuNTg1NiA4NC43MzM1IDQ5LjI0NDggODIuMDMyNiA0OC42NDI0QzgwLjMxNzcgNDguMjU5OSA3OS40NDYzIDQ3Ljg3NjQgNzguODYzMyA0Ny4yNDc2Qzc4LjMwNjEgNDYuNjQ2NyA3OC4xNTE3IDQ2LjE4ODIgNzguMTY2MSA0NS4xNzY3Qzc4LjE4MTIgNDQuMTEyNyA3OC41MDg5IDQzLjM0MDQgNzkuMjQyMSA0Mi42NDA5QzgwLjE4MyA0MS43NDMyIDgxLjEyODUgNDEuNDE1NSA4Mi43Nzg2IDQxLjQxNTVDODMuOTQ2MSA0MS40MTU1IDg0LjczNzUgNDEuNTg1MyA4NS40ODU3IDQxLjk5NkM4Ni40NzkxIDQyLjU0MTUgODcuMjI1NCA0My42OTM0IDg3LjMyODUgNDQuODQwNkw4Ny4zODIxIDQ1LjQzNjhIODYuMjI0M0g4NS4wNjY2VjQ1LjEwOTFDODUuMDY2NiA0NC41ODIgODQuNzUyMSA0NC4xMTE3IDg0LjIxMTkgNDMuODMxMkM4My43ODY4IDQzLjYxMDQgODMuNjAzNyA0My41ODAzIDgyLjY4MTggNDMuNTgwM0M4MS44MzE1IDQzLjU4MDMgODEuNTYxMSA0My42MTc4IDgxLjI0MzIgNDMuNzgxQzgwLjcyODcgNDQuMDQ0OCA4MC40NjgyIDQ0LjQyMDUgODAuNDU1MyA0NC45MTcyQzgwLjQzNTYgNDUuNjcyOSA4MC44NTc4IDQ1LjkyODEgODMuMDQ0MyA0Ni40ODI3Qzg1LjQ0NCA0Ny4wOTE0IDg2LjI1NzQgNDcuNDM4MSA4Ny4wMjk1IDQ4LjE4MUM4Ny42IDQ4LjcyOTkgODcuNzg5MiA0OS4zMjM5IDg3LjczMzQgNTAuMzkwN0M4Ny42NDA2IDUyLjE2NjEgODYuNTQxMyA1My40NjM3IDg0LjY5MiA1My45ODFDODMuODkwNSA1NC4yMDUzIDgxLjk2NzQgNTQuMjI0MiA4MS4wMjQxIDU0LjAxNjhMODEuMDI0MiA1NC4wMTczWk02MS40OTE0IDQ3Ljc5MjVWNDEuNzIxM0g2Mi42ODVINjMuODc4N1Y0Ny43OTI1VjUzLjg2MzZINjIuNjg1SDYxLjQ5MTRWNDcuNzkyNVpNNjYuMzY1NSA0Ny43OTI1VjQxLjcyMTNINjcuNDU5OEg2OC41NTRWNDIuNDMxOVY0My4xNDI0TDY5LjA0MjUgNDIuNjAzMkM2OS4zMTExIDQyLjMwNjcgNjkuNzQ4OSA0MS45NDQ0IDcwLjAxNTMgNDEuNzk4MUM3MC41NzI4IDQxLjQ5MTkgNzEuNTQyNSA0MS4zMDUyIDcyLjA0MTIgNDEuNDA3OUw3Mi4zODM3IDQxLjQ3ODdMNzIuNDExNiA0Mi43MDRMNzIuNDM5NSA0My45MjkzSDcxLjY3NzFDNzAuNjkxOSA0My45MjkzIDcwLjIzNjcgNDQuMDc0IDY5LjY4NzggNDQuNTYxM0M2OC43Mjk2IDQ1LjQxMjMgNjguNjUzNCA0NS44MzU0IDY4LjY1MzQgNTAuMzA2NVY1My44NjRINjcuNTA5NUg2Ni4zNjU1VjQ3Ljc5MjhMNjYuMzY1NSA0Ny43OTI1Wk03My42MjcxIDQ3Ljc5MjVWNDEuNzIxM0g3NC44MjA4SDc2LjAxNDVWNDcuNzkyNVY1My44NjM2SDc0LjgyMDhINzMuNjI3MVY0Ny43OTI1Wk02MS40OTE0IDM4LjY2MDZWMzcuMzA2SDYyLjY4NUg2My44Nzg3VjM4LjY2MDZWNDAuMDE1M0g2Mi42ODVINjEuNDkxNFYzOC42NjA2Wk03My42MjcxIDM4LjY2MDZWMzcuMzA2SDc0LjgyMDhINzYuMDE0NVYzOC42NjA2VjQwLjAxNTNINzQuODIwOEg3My42MjcxVjM4LjY2MDZaIiBmaWxsPSIjMTAzNDQ0Ii8+DQo8cGF0aCBkPSJNMTE0LjQ0OSAyNi4yNzcxTDEwOC4zMSA4LjUxNjZMODkuNjYxOSA4LjkxOTRMODQuMjgwOCAyNi45MzU1TDk5LjU5NzEgMzcuNjY2NUwxMTQuNDQ5IDI2LjI3NzFaIiBmaWxsPSIjMzdBM0I2Ii8+DQo8cGF0aCBkPSJNMTE0LjQzOCAxOC4wMzM5QzExNC40MzggMjAuMzY2OSAxMTMuOTgyIDIyLjY3NyAxMTMuMDk3IDI0LjgzMjRDMTEyLjIxMiAyNi45ODc4IDExMC45MTUgMjguOTQ2MyAxMDkuMjggMzAuNTk1OUMxMDcuNjQ1IDMyLjI0NTYgMTA1LjcwMyAzMy41NTQyIDEwMy41NjcgMzQuNDQ3QzEwMS40MyAzNS4zMzk4IDk5LjE0MDIgMzUuNzk5MyA5Ni44Mjc2IDM1Ljc5OTNDOTIuMTU3IDM1Ljc5OTMgODcuNjc3OCAzMy45Mjc2IDg0LjM3NTIgMzAuNTk1OUM4MS4wNzI3IDI3LjI2NDMgNzkuMjE3MyAyMi43NDU2IDc5LjIxNzMgMTguMDMzOUM3OS4yMTczIDEzLjMyMjMgODEuMDcyNyA4LjgwMzU3IDg0LjM3NTIgNS40NzE5MkM4Ny42Nzc4IDIuMTQwMjcgOTIuMTU3IDAuMjY4NTYgOTYuODI3NiAwLjI2ODU1NUM5OS4xNDAyIDAuMjY4NTUyIDEwMS40MyAwLjcyODA2NSAxMDMuNTY3IDEuNjIwODZDMTA1LjcwMyAyLjUxMzY1IDEwNy42NDUgMy44MjIyNCAxMDkuMjggNS40NzE5QzExMC45MTUgNy4xMjE1NyAxMTIuMjEyIDkuMDgwMDEgMTEzLjA5NyAxMS4yMzU0QzExMy45ODIgMTMuMzkwOCAxMTQuNDM4IDE1LjcwMDkgMTE0LjQzOCAxOC4wMzM5VjE4LjAzMzlaIiBmaWxsPSJ1cmwoI3BhaW50Ml9yYWRpYWxfOTg5XzMyODEpIi8+DQo8cGF0aCBvcGFjaXR5PSIwLjIzNTA2IiBkPSJNMTA4LjM2NCA4LjY4MDY2TDg5LjcwMjcgOS4wNzEyOEw4Ny41MzQ3IDE2LjMwOThDODkuMzk5NCAxNi4zMDE0IDkxLjEwMTggMTYuMzEwNSA5MS4zMjg4IDE2LjMwOThDMTAyLjQyMyAxNi4yODk4IDEwOC44MTEgMjEuNzQ0OCAxMTAuMzUxIDIzLjIzNThDMTEwLjU1IDIzLjQyOCAxMTIuNzI2IDI2LjAwMTIgMTEzLjY1NSAyNy4xMTUzTDExNC41MDYgMjYuNDY0NEwxMDguMzY0IDguNjgwNjZaIiBmaWxsPSIjMUI0OTdBIi8+DQo8cGF0aCBkPSJNMTA4LjMxMyA4LjYzNDc3TDg5LjY3MTkgOS4wMzA1Mkw4NC4yODMgMjcuMDQ0M0w5OS42MDExIDM3Ljc3OThMMTE0LjQ1NSAyNi40MDYxTDEwOC4zMTMgOC42MzQ3N1Y4LjYzNDc3Wk0xMDYuMjYzIDExLjQ5NDNMMTEwLjk5NiAyNS43NzZMOTkuNTQ1IDM0LjkyMDJMODcuNzQyMSAyNi4yOTNMOTEuODkgMTEuODE3NEwxMDYuMjYzIDExLjQ5NDNaIiBmaWxsPSIjMUI0OTdBIi8+DQo8ZGVmcz4NCjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQwX3JhZGlhbF85ODlfMzI4MSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgxMTIuNjI1IDQwLjUwMTgpIHNjYWxlKDE1LjkyNjkgMTYuMDY3MikiPg0KPHN0b3Agc3RvcC1jb2xvcj0iI0QxRkZGRiIvPg0KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIi8+DQo8L3JhZGlhbEdyYWRpZW50Pg0KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzk4OV8zMjgxIiB4MT0iMTI2LjQ4NCIgeTE9IjU3LjE3MjYiIHgyPSIxMTMuMDg0IiB5Mj0iMzAuMzc4MSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPg0KPHN0b3Agc3RvcC1jb2xvcj0iIzA5NjU5RSIvPg0KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMEQ3M0FEIi8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDJfcmFkaWFsXzk4OV8zMjgxIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDk2LjgyNzUgMTguMDMzOSkgc2NhbGUoMTcuNjEwMyAxNy43NjU0KSI+DQo8c3RvcCBzdG9wLWNvbG9yPSIjRDFGRkZGIi8+DQo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjAiLz4NCjwvcmFkaWFsR3JhZGllbnQ+DQo8L2RlZnM+DQo8L3N2Zz4NCg==' />
                            </div>
                            <div style='display: block !important;
                            justify-content: center !important;
                            padding: 30px !important;
                            overflow: hidden !important;
                            text-align: justify !important;' class='body'>
                                <h1 style=' text-align: center !important;'>Titulo del correo</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim cupiditate quod quasi, nulla maxime
                                    dicta magnam perferendis explicabo, ratione voluptatibus vero neque, deleniti minima quaerat
                                    accusamus unde eius fugit delectus.</p>
                                <table style='width: 100% !important;' class='tableMail'>
                                    <thead>
                                        <tr>
                                            <th style='border-bottom: #999 solid 1px !important;'>No.</th>
                                            <th style='border-bottom: #999 solid 1px !important;'>Detail</th>
                                            <th style='border-bottom: #999 solid 1px !important;'>Detail 2</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>value 1</td>
                                            <td>value 1</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>value 1</td>
                                            <td>value 1</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>value 1</td>
                                            <td>value 1</td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>value 1</td>
                                            <td>value 1</td>
                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>value 1</td>
                                            <td>value 1</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div style='padding-top: 20px !important;
                                text-align: center !important;' class='body-options'>
                                    <input type='button' style=' font-style: normal !important;
                                    font-weight: 500 !important;
                                    border-radius: 100px !important;
                                    padding: 1px 30px 10px 40px !important;
                                    text-transform: uppercase !important;
                                    background-color: #05A5C7 !important;
                                    padding: 15px !important;
                                    border: none !important;
                                    color: #fff !important;
                                    width: 200px !important;
                                    margin: 30px auto !important;' class='btn' value='Button'>
                                </div>
                                
                            </div>
                            <div style=' padding: 30px !important;
                            color: #999999 !important;
                            display: block !important;
                            text-align: justify !important;' class='footer'>
                                <p style=' display: table-cell !important;
                                width: 45% !important;
                                line-height: 100% !important;'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim cupiditate quod quasi, nulla maxime
                                    dicta magnam perferendis explicabo</p>
                                <div style=' display: table-cell !important;
                                width: 45% !important;
                                text-align: right !important;' class='contact-info'>
                                    <p>contactanos: grupoiris@iris.es</p>
                                    <p>tel: +999 999 9999</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>";
                correo.IsBodyHtml = true;
                correo.Priority = MailPriority.Normal;
                SmtpClient smtp = new SmtpClient();
                smtp.UseDefaultCredentials = false;
                smtp.Host = "smtp.gmail.com";
                //smtp.Host = "webmail.softcode.es"; //Host del servidor de correo
                smtp.Port = 587; //Puerto de salida
                                 //spnqaxxmdyddavep
                                 //smtp.Credentials = new System.Net.NetworkCredential("iris@softcode.es", "^43dyRk6kn6VjXkog");//Cuenta de correo
                smtp.Credentials = new System.Net.NetworkCredential("w1987@gmail.com", "spnqaxxmdyddavep");//Cuenta de correo
                ServicePointManager.ServerCertificateValidationCallback = delegate (object s,
                 X509Certificate certificate,
                 X509Chain chain, SslPolicyErrors sslPolicyErrors)
                 { return true; };
                smtp.EnableSsl = true;//True si el servidor de correo permite ssl
                smtp.Send(correo);
                return true;
            }
            catch (Exception)
            {
                return true;
            }

        }
    }
}