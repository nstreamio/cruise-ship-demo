import { Property } from "@swim/component";
import { HtmlView, NodeView, TextView } from "@swim/dom";
import { PanelController } from "@swim/panel";
import { ViewRef } from "@swim/view";

export class SavingsController extends PanelController {
  deckNumber: number;

  constructor(deckNumber: number) {
    super();
    this.deckNumber = deckNumber;
  }

  protected override onMount(): void {
    const panelView = this.panel.attachView();
    this.content.insertView(panelView);
  }

  private getTimeText(num: number): string {
    let hoursText = "";
    if (num >= 1) {
      hoursText = `${Math.floor(num)} hours`;
    }
    let minutesText = "";
    if ((num % 1).toFixed(2) !== "0.00") {
      let minutes = ((num % 1) * 60).toFixed(0);
      minutesText = `${minutes} minutes`;
    }

    const result = `${hoursText}${
      hoursText && minutesText ? " and " : ""
    }${minutesText}`;

    return result || "No time";
  }

  @Property({
    valueType: Number,
    value: 0,
    inherits: true,
    extends: true,
    didSetValue(newValue: number = 0, oldValue = 0): void {
      const savingsTimeTextEl = document.getElementById("savings-time-text");
      if (savingsTimeTextEl) {
        savingsTimeTextEl.innerText = `${this.owner.getTimeText(
          Number.parseFloat(newValue.toFixed(2))
        )} spent in EcoMode`;
      }
      const savingsMoneyTextEl = document.getElementById("savings-money-text");
      if (savingsMoneyTextEl) {
        savingsMoneyTextEl.innerText = `Deck ${
          this.owner.deckNumber
        }'s savings: $${newValue.toFixed(2)}`;
      }
    },
  })
  readonly deckSavings!: Property<this, number>;

  @ViewRef({
    viewType: HtmlView,
    createView(): HtmlView {
      const containerView = new HtmlView(document.createElement("div")).set({
        classList: ['savings-text-container'],
      });
      const pTimeView = new HtmlView(document.createElement("p")).set({
        classList: ['savings-text'],
        text: `${this.owner.getTimeText(
          Number.parseFloat(this.owner.deckSavings.value.toFixed(2))
        )} spent in EcoMode`,
      });
      pTimeView.node.id = "savings-text";
      containerView.appendChild(pTimeView);
      const pMoneyView = new HtmlView(document.createElement("p")).set({
        classList: ['savings-text'],
        text: `Deck ${
          this.owner.deckNumber
        }'s savings: $${this.owner.deckSavings.value.toFixed(2)}`,
      });
      pMoneyView.node.id = "savings-text";
      containerView.appendChild(pMoneyView);

      return containerView;
    },
  })
  readonly content!: ViewRef<this, HtmlView>;
}
