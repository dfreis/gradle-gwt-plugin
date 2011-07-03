package net.desource.samples.fortune.client.ui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.Widget;
import net.desource.samples.fortune.client.Fortune;

/**
 *
 */
public class FortuneTellerView extends Composite implements FortuneTeller {

    interface ViewUiBinder extends UiBinder<Widget, FortuneTellerView> {}
    private final static ViewUiBinder BINDER = GWT.create(ViewUiBinder.class);

    private Listener listener;

    @UiField Element fortune;
    @UiField HTML revealFortune;

    public FortuneTellerView() {
        initWidget(BINDER.createAndBindUi(this));
    }

    public void setListener(Listener listener) {
        this.listener = listener;
    }

    public Widget asWidget() {
        return this;
    }

    public void updateFortune(Fortune fortune) {
        this.fortune.setInnerText(fortune.getFortune());
        revealFortune.setHTML("Show me another");
    }

    @UiHandler("revealFortune")
    public void onRevealFortune(ClickEvent click) {
        fortune.setInnerText("...waiting...");
        listener.revealFortune();
    }

}
