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
    const panelView = this.panel.attachView().set({
      style: {
        backgroundColor: "#212121",
      },
      classList: ["savings-controller-panel"],
    });
    this.content.insertView(panelView);
  }

  private getTimeText(num: number): string {
    let hoursText = "";
    if (num >= 1) {
      hoursText = `${num.toFixed(0)} hours`;
    }
    let minutesText = "";
    if ((num % 1).toFixed(2) !== "0.00") {
      minutesText = `${((num % 1) * 60).toFixed(0)} minutes`;
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
          newValue
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
        style: {
          backgroundColor: "#212121",
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        },
      });
      const pTimeView = new HtmlView(document.createElement("p")).set({
        style: {
          fontSize: "18px",
          textAlign: "center",
        },
        text: `${this.owner.getTimeText(
          this.owner.deckSavings.value
        )} spent in EcoMode`,
      });
      pTimeView.node.id = "savings-time-text";
      containerView.appendChild(pTimeView);
      const pMoneyView = new HtmlView(document.createElement("p")).set({
        style: {
          fontSize: "18px",
          textAlign: "center",
        },
        text: `Deck ${
          this.owner.deckNumber
        }'s savings: $${this.owner.deckSavings.value.toFixed(2)}`,
      });
      pMoneyView.node.id = "savings-money-text";
      containerView.appendChild(pMoneyView);

      return containerView;
    },
  })
  readonly content!: ViewRef<this, HtmlView>;
}
