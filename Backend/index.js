/* eslint-disable no-restricted-globals */
const express = require("express");
require("actions-on-google");
// require('dotenv').config();
const axios = require("axios");
const { WebhookClient } = require("dialogflow-fulfillment");
const app = express();
const { google } = require("googleapis");

const calendarId =
  "412abf3f6a5ed95d0413ab0275ffb2e18b62303bc1ea04278a29225000719970@group.calendar.google.com";
const serviceAccount = {
  type: "service_account",
  project_id: "ajax-yhar",
  private_key_id: "8aa441dc2de183c72565bafc9fd1a331fea87785",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvPdCVFZsa955I\nK/VUkYvR51TZ2TxnkoPeAVr0i0PbVmF6otpam7IyOl5QrBS4e5uh1QkWj4oQMzXg\nKkDu5QDndaiIBIc6QFljwHVz1BgPgPhL48I190rHTHIJOl6oFbt1oOiqdSoddTLF\nOe7fNHC1Q5+CfL7MIEAfVl0vpHZog4t+iZHG+5Yx2AM2EoCknxRxi/4VbhY6y5bP\nHVPLsbUnyWAh2nWpleSzQVidCvMwZX0VkeNZJOZ8FP5wmQPu784J7Uga5KDr55ja\nOFCRtSftZUwSFLDaQEf6T8W3OOmiCucXIkLJ7Y53No4pwsSarHoi/W68PI460BVZ\nEJhgR1k1AgMBAAECggEABHLhiXNdt2rLXCIvjXjPb6H7i7dB2xBDZD6tEDG75ITW\nHy6ks/GpbbCBJfOkaAWNTyexHh9BPkWKi9kOwnHSWs3oHCHfS/mHu2pOoQTkonof\n849B5ixTu+kDKRxP/Fzm4CbYWUF1sv8/bXXZzFVQui1QDpg7oMN91T3USkoWznLj\nmmkSo7S+8mgX7V65gd4V/W6DqS5VJpGGs13/DLX09mHF6AwEYYyTiKfGaQGRTgR3\nfRaJ2C21UfLy0N2IrGIYIutJqr7ccxnM2m8slYvozsVd8jzCmLxKifcVRV7IlMcb\n646aR3cjKisrhHEY/313Yo993wfOx0id5KIvt+QWaQKBgQDz6OaeTyqdrmssUr1O\nFzTP2atTBR7xFa8CtuGdvxUMnqKb1B6VDUm9k2q0Nd5CMwYy7bDMjXYjF8Yr2ciG\n1Aa0O4zfTkDaYOTejR1BSZKnqJ6s0rKG6Mf7udif/rEyjR6IbMbN7IhkmEMEWVUo\n4aj+GVL9tO2FDjiR9AzjjBi0CQKBgQC37Yu1h/1+DGar9s/3LuL2O44uF4DoxDlF\nrRwkayniORpps8ypA9upYKWWFqCfW85h4bXwaQtasrOQ9Dx14tKOUlTHbIFuxDYq\nZbh3EjRfUBjLFZOBJjnSu4rEjz8O0PX0xyCWlxb6WusftECcXPeAfu7iqFgHMsND\nCelhCP0+zQKBgQCjMIhcEwuoRDJgjVsrDEvBZRlDioGRO7jEUCfTqy0iLGEPcXSk\ntSdJN4CE4iW6lPjoyi8oLN2FzTpBzIxl6SYzIES4g1rQwVNfs3qHW/pLQn4nkzDv\nIn/q5AUTxww3jkOHc3/v9vmqlFUCa+KWX6T5nWfxZ0QjachfnrGg7PL6QQKBgG4I\nj6c3RwCsnJPOIRZIl4ElmeabKwSVt4mmiYqEDdeHv/Rym0KVy0jmR8mlmcwcWTiX\nlofP3/oPpHtYkf8YhkyclpmDoV9JxPnSRuv9GRXYTizYqJj/7GHUzqzO4bOUcUBS\nDH3qv9VgpP8fj/O7bloSFgnFGnyb8tLdUCA8B30VAoGBALYokRRlUj7/kP8GsjWw\na0usQfHjQKyMuyGb0sAv1TQg1mdxxuYWKgNrzpB+ib0pmBzj5M2w/Uf11nHDa2Lm\nT6Fbm66oXbwIwgILfKIOyKdJpfyZJlN7x9SjYNF6nD30jB9RKcojUUVextGpB37K\nW/isydIvlghv6RjzeAYGHKux\n-----END PRIVATE KEY-----\n",
  client_email: "ajax-bot@ajax-yhar.iam.gserviceaccount.com",
  client_id: "116771693228510786133",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/ajax-bot%40ajax-yhar.iam.gserviceaccount.com",
};

const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: "https://www.googleapis.com/auth/calendar",
});

const calendar = google.calendar("v3");
process.env.DEBUG = "dialogflow:*"; // enables lib debugging statements

const timeZone = "Asia/Kolkata";
const timeZoneOffset = "+05:30";

app.post("/webhook", express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

   function createCalendarEvent(appointment, startTime, endTime) {
    return new Promise((resolve, reject) => {
      calendar.events.list(
        {
          auth: serviceAccountAuth,
          calendarId: calendarId,
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
        },
        (err, res) => {
          if (err || res.data.items.length > 0) {
            console.log(err.response.data.error);
            reject(`The even is conflicting with another event`);
          } else {
            calendar.events.insert(
              {
                auth: serviceAccountAuth,
                calendarId: calendarId,
                resource: {
                  summary: appointment + "Reminder",
                  description: appointment,
                  start: { dateTime: startTime },
                  end: { dateTime: endTime },
                },
              },
              (err, events) => {
                if (err)
                  return reject(
                    `There was an error contacting the Calendar service: ${err}`
                  );
                return resolve(events);
              }
            );
          }
        }
      );
    });
  }

  function makeAppointment(agent) {
    // Calculate appointment start and end datetimes (end = +1hr from start)
    const appointment = agent.parameters.AppointmentType;
    // const date = agent.parameters.date;
    // const time = agent.parameters.time;

    const dateTimeStart = new Date(
      Date.parse(
        agent.parameters.date.split("T")[0] +
          "T" +
          agent.parameters.time.split("T")[1].split("+")[0] +
          timeZoneOffset
      )
    );
    const dateTimeEnd = new Date(
      new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1)
    );
    const appointmentTimeString = dateTimeStart.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      timeZone: timeZone,
    });

    //   Check the availibility of the time, and make an appointment if there is time on the calendar
    return createCalendarEvent(appointment, dateTimeStart, dateTimeEnd)
      .then(() => {
        agent.add(
          `Ok, let me see if we can fit you in. I have added ${appointment} on ${dateTimeStart.toString()}  is fine!.`
        );
      })
      .catch(() => {
        agent.add(
          `I'm sorry, there are no slots available for ${appointmentTimeString}.`
        );
      });
  }

  let intentMap = new Map();
  intentMap.set("schedule_drv", makeAppointment);
  agent.handleRequest(intentMap);
});

app.post("/dialogflow", express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", queryGPT);
  agent.handleRequest(intentMap);

  function welcome(agent) {
    agent.add(
      "Hi, I am your personal digital AI assistant, NOVA. How are you doing today?"
    );
  }

  async function queryGPT(agent) {
    // agent.add('Sorry! I am unable to understand this at the moment. I am still learning. You can pick any of the service that might help me.');
    const instance = axios.create({
      baseURL: "https://api.openai.com/v1/",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    });

    const dialog = [
      `The following is a conversation with an AI assistant that can have meaningful conversations with users. The assistant is helpful, empathic, and friendly. Its objective is to make the user feel better by feeling heard. With each response, the AI assisstant prompts the user to continue the conversation in a natural way.
AI: Hello, I am your personal digital AI assistant, NOVA. How are you doing today?`,
    ];
    let query = agent.query;
    console.log("querytext ", query);
    dialog.push(`User: ${query}`);
    dialog.push("AI:");
    // agent.add(`you said ${query}`)

    const completionParmas = {
      prompt: dialog.join("\n"),
      max_tokens: 60,
      temperature: 0.85,
      n: 1,
      stream: false,
      logprobs: null,
      echo: false,
      stop: "\n",
    };

    try {
      const result = await instance.post(
        "/engines/davinci/completions",
        completionParmas
      );
      const botResponse = result.data.choices[0].text.trim();
      agent.add(botResponse);
    } catch (err) {
      console.log(err);
      agent.add("Sorry. Something went wrong. Can you say that again?");
    }
  }
});

const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));
