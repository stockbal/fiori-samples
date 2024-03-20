import { ApplicationService } from "@sap/cds";

export default class PaymentService extends ApplicationService {
  override async init() {
    const { Payments, OpenItems } = this.entities;
    this.before(["UPDATE", "PATCH"], Payments, async (req) => {
      if (req.data.costs < 10) {
        throw req.error(400, "Costs must be higher than 10", "costs");
      }
    });
    this.before(["UPDATE"], OpenItems.drafts!, async (req) => {
      if ("costs" in req.data && req.data.costs < 10) {
        const err = req.error(400, "Costs must be higher than 10", "costs");
        (err as any).transition = true;
        throw err;
      }
    });
    await super.init();
  }
}
