import { ApplicationService } from "@sap/cds";

export default class PaymentService extends ApplicationService {
  override async init() {
    const { Payments } = this.entities;
    this.before(["UPDATE", "PATCH"], Payments, async (req) => {
      if (req.data.costs < 10) {
        throw req.error(400, "Costs must be higher than 10", "costs");
      }
    });
    return super.init();
  }
}
