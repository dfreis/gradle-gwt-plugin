package sample.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.inject.client.GinModules;
import com.google.gwt.inject.client.Ginjector;
import com.google.gwt.user.client.ui.RootPanel;

/**
 *
 */
public class UiEntryPoint implements EntryPoint {

    public interface UiFactory extends Ginjector {
        App  getApp();
    }

    // can override DefaultUiFactory.class with &lt;replace-with> rules in a gwt.xml file
    @GinModules({UiModule.class})
    public interface DefaultUiFactory extends UiFactory {}
    protected static UiFactory factory = GWT.create(DefaultUiFactory.class);

    public void onModuleLoad() {

        App app = factory.getApp();

        app.run(RootPanel.get());

    }
}
