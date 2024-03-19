import { MapDownlink } from "@swim/client";
import { HtmlView } from "@swim/dom";
import { PanelController } from "@swim/panel";
import { Value } from "@swim/structure";
import { Uri } from "@swim/uri";
import { ViewRef } from "@swim/view";

export class BadgePanelController extends PanelController {
  constructor() {
    super();
  }

  protected override onMount(): void {
    const panelView = this.panel.view;
    this.container.insertView(panelView);
  }

  @ViewRef({
    viewType: HtmlView,
    createView(): HtmlView {
      const containerView = new HtmlView(document.createElement("div")).set({
        classList: ['badge-panel-container'],
      });
      containerView.node.style.width = "calc(100% - 12px)";
      containerView.node.style.height = "calc(100% - 6px)";

      const header = new HtmlView(document.createElement("p")).set({
        classList: ['badge-panel-header'],
        text: "Dev Panel",
      });
      containerView.appendChild(header);

      const form = new HtmlView(document.createElement("form")).set({
        classList: ['badge-panel-form'],
      });
      const that = this;
      (form.node as HTMLFormElement).addEventListener("submit", function (e) {
        e.preventDefault();
        const roomNumber = Number.parseInt(
          (new FormData(e.target as HTMLFormElement).get("roomNumber") as
            | string
            | null) ?? ""
        );
        that.owner.swipeBadge(roomNumber);
      });
      containerView.appendChild(form);

      const label = new HtmlView(document.createElement("label")).set({
        classList: ['badge-panel-label'],
        text: "Badge guest in/out",
      });
      form.appendChild(label);

      this.owner.inputView.insertView(label);

      const submit = new HtmlView(document.createElement("input")).set({
        classList: ['badge-panel-submit'],
        text: "Submit",
      });
      (submit.node as HTMLInputElement).type = "submit";
      form.appendChild(submit);

      return containerView;
    },
  })
  readonly container!: ViewRef<this, HtmlView>;

  @ViewRef({
    viewType: HtmlView,
    createView(): HtmlView {
      const input = new HtmlView(document.createElement("input")).set({
        classList: ['badge-panel-input'],
      });
      (input.node as HTMLInputElement).type = "text";
      (input.node as HTMLInputElement).name = "roomNumber";
      (input.node as HTMLInputElement).placeholder = "Room #";

      return input;
    },
  })
  readonly inputView!: ViewRef<this, HtmlView>;

  @MapDownlink({
    laneUri: "simulate",
    keyForm: Uri.form(),
  })
  readonly simulateDownlink!: MapDownlink<this, Uri, Value>;

  private async swipeBadge(roomNumber: number): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    let host = urlParams.get("host");
    const baseUri = Uri.parse(document.location.href);
    if (!host) {
      host = baseUri.base().withScheme("https").toString();
    } else if (host.startsWith("warp")) {
      host = `http${host.slice(4)}`;
    }
    if (/nstream-demo/.test(host)) {
      host = host.replace("nstream-demo", "services.nstream-demo");
    }

    const deckNumber = roomNumber
      .toString()
      .split("")
      .slice(0, roomNumber > 9999 ? 2 : 1)
      .join("");

    (this.inputView.attachView().node as HTMLInputElement).disabled = true;

    const url = `${host}${
      host.endsWith("/") ? "" : "/"
    }ship/olympic/deck/${deckNumber}/room/${roomNumber}?lane=simulate&action=swipeBadge`;

    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
    });

    (this.inputView.attachView().node as HTMLInputElement).disabled = false;
  }
}
