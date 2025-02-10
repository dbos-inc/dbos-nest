import { Injectable } from "@nestjs/common";
import { DBOS } from "@dbos-inc/dbos-sdk";
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const config: Config = {
  dictionaries: [adjectives, colors, animals], // Order of dictionaries
  separator: '-',
  length: 2,
  style: 'capital', // Capitalizes each word
};

interface GreetingRecord {
  greeting_name: string;
  greeting_note_content: string;
}

@Injectable()
export class AppService {
  @DBOS.workflow()
  static async getHello() {
    DBOS.logger.info("Hello from a wf");
    await AppService.sendhttprequest();
    await AppService.insert();
    return "Hello World!";
  }

  @DBOS.step()
  static async sendhttprequest() {
    const response = await fetch("https://example.com");
    const data = await response.text();
    return data;
  }

  @DBOS.transaction()
  static async insert(): Promise<GreetingRecord> {
       const randomName: string = uniqueNamesGenerator(config);
      return DBOS.knexClient<GreetingRecord>("dbos_greetings").insert(
          { greeting_name: randomName, greeting_note_content: "Hello World!" },
      );
  }
}
