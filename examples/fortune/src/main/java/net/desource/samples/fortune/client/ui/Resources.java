package net.desource.samples.fortune.client.ui;

import com.google.gwt.resources.client.ClientBundle;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.resources.client.ImageResource;

/**
 *
 */
public interface Resources extends ClientBundle {

    public interface Styles extends CssResource {
        String footer();
    }

    @Source("styles.css") @CssResource.NotStrict
    Styles styles();

    ImageResource footer();

}
