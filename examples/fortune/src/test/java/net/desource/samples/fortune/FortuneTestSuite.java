package net.desource.samples.fortune;

import com.google.gwt.junit.tools.GWTTestSuite;
import junit.framework.Test;
import junit.framework.TestSuite;
import net.desource.samples.fortune.client.AppEntryPointTest;

/**
 *
 */
public class FortuneTestSuite extends GWTTestSuite {

    public static Test suite() {
        TestSuite suite = new TestSuite("Tests for a Fortune Application requiring GWT");
        suite.addTestSuite(AppEntryPointTest.class);
        return suite;
    }

}
