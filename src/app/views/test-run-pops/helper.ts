import { MessageEmail } from "../model/MessageEmail";
import { ObjectState } from "../model/objects-state";

export const mockData: MessageEmail[] = new Array(10)
  .fill(1)
  .map((id, i) => ({
    User:'John doe',
    MailHost:`Host `+ i,
    Checked:false,
    InboundHost:`00${i + 1}`,
    Enabled: Math.random() < 0.5,
    Secured: Math.random() < 0.5,
    OutboundHost:`00${i + 1}`,
    Password:'12345678',
    Action:'View details',
    Id: id + i,
    id:id + i,
    Tenants: [],
    Mail: [
      'Jecil@gmail.com',
      'Akintunde@gmail.com',
      'Babatunde@gmail.com',
      'Busayo@gmail.com',
      'Jibola@gmail.com',
      'bola@gmail.com',
      'James@gmail.com',
      'John@gmail.com',
    ],
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
    State: ObjectState.New,
    Tenant: `Tenant${id + i}`,
  }));


function randomEnum<T extends object>(anEnum: T): T[keyof T] {
    const enumValues = Object.values(anEnum) as unknown as T[keyof T][];
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
}

