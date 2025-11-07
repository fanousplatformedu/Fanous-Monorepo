import { ConsentType, ConsentStatus } from "@prisma/client";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(ConsentType, {
  name: "ConsentType",
  description: "Type of consent",
});
registerEnumType(ConsentStatus, {
  name: "ConsentStatus",
  description: "Status of consent",
});

export { ConsentType, ConsentStatus };
