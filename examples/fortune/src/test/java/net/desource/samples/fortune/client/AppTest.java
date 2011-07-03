package net.desource.samples.fortune.client;

import net.desource.samples.fortune.client.remote.FortuneService;
import net.desource.samples.fortune.client.ui.FortuneTeller;
import org.junit.Test;
import org.mockito.Matchers;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

/**
 *
 */
public class AppTest {

    @Test
    public void testSimple() {

        FortuneService fortuneService = mock(FortuneService.class);
        FortuneTeller fortuneTeller = mock(FortuneTeller.class);

        App app = new App(fortuneService, fortuneTeller);

        app.revealFortune();

        verify(fortuneService).getFortune((FortuneService.Callback) Matchers.anyObject());
//        verify(fortuneTeller).updateFortune((Fortune)anyObject());

//        app.run();
    }

}
