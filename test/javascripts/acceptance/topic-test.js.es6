import { acceptance } from "helpers/qunit-helpers";
acceptance("Topic", { loggedIn: true });

test("Share Popup", () => {
  visit("/t/internationalization-localization/280");
  andThen(() => {
    ok(!exists('#share-link.visible'), 'it is not visible');
  });

  click("button[data-share-url]");
  andThen(() => {
    ok(exists('#share-link.visible'), 'it shows the popup');
  });

  click('#share-link .close-share');
  andThen(() => {
    ok(!exists('#share-link.visible'), 'it closes the popup');
  });

  // TODO tgxworld This fails on Travis but we need to push the security fix out
  // first.
  // click('#topic-footer-buttons .btn.create');
  // fillIn('.d-editor-input', '<h2><div data-share-url="something">Click</button><h2>');
  //
  // click('#reply-control .btn.create');
  // click('h2 div[data-share-url]');
  //
  // andThen(() => {
  //   ok(!exists('#share-link.visible'), 'it does not show the popup');
  // });
});

test("Showing and hiding the edit controls", () => {
  visit("/t/internationalization-localization/280");

  click('#topic-title .fa-pencil');

  andThen(() => {
    ok(exists('#edit-title'), 'it shows the editing controls');
  });

  fillIn('#edit-title', 'this is the new title');
  click('#topic-title .cancel-edit');
  andThen(() => {
    ok(!exists('#edit-title'), 'it hides the editing controls');
  });
});

test("Updating the topic title and category", () => {
  visit("/t/internationalization-localization/280");
  click('#topic-title .fa-pencil');

  fillIn('#edit-title', 'this is the new title');
  selectDropdown('.category-combobox', 4);

  click('#topic-title .submit-edit');

  andThen(() => {
    equal(find('#topic-title .badge-category').text(), 'faq', 'it displays the new category');
    equal(find('.fancy-title').text().trim(), 'this is the new title', 'it displays the new title');
  });
});

test("Marking a topic as wiki", () => {
  server.put('/posts/398/wiki', () => { // eslint-disable-line no-undef
    return [
      200,
      { "Content-Type": "application/json" },
      {}
    ];
  });

  visit("/t/internationalization-localization/280");

  andThen(() => {
    ok(find('a.wiki').length === 0, 'it does not show the wiki icon');
  });

  click('.topic-post:eq(0) button.show-more-actions');
  click('.topic-post:eq(0) button.show-post-admin-menu');
  click('.btn.wiki');

  andThen(() => {
    ok(find('a.wiki').length === 1, 'it shows the wiki icon');
  });
});

test("Reply as new topic", () => {
  visit("/t/internationalization-localization/280");
  click("button.share:eq(0)");
  click(".reply-as-new-topic a");

  andThen(() => {
    ok(exists('.d-editor-input'), 'the composer input is visible');

    equal(
      find('.d-editor-input').val().trim(),
      `Continuing the discussion from [Internationalization / localization](${window.location.origin}/t/internationalization-localization/280):`,
      "it fills composer with the ring string"
    );
    equal(
      find('.category-combobox').select2('data').text, "feature",
      "it fills category selector with the right category"
    );
  });
});

test("Reply as new message", () => {
  visit("/t/pm-for-testing/12");
  click("button.share:eq(0)");
  click(".reply-as-new-topic a");

  andThen(() => {
    ok(exists('.d-editor-input'), 'the composer input is visible');

    equal(
      find('.d-editor-input').val().trim(),
      `Continuing the discussion from [PM for testing](${window.location.origin}/t/pm-for-testing/12):`,
      "it fills composer with the ring string"
    );

    const targets = find('.item span', '.composer-fields');

    equal(
      $(targets[0]).text(), "someguy",
      "it fills up the composer with the right user to start the PM to"
    );

    equal(
      $(targets[1]).text(), "test",
      "it fills up the composer with the right user to start the PM to"
    );

    equal(
      $(targets[2]).text(), "Group",
      "it fills up the composer with the right group to start the PM to"
    );
  });
});

test("Updating the topic title with emojis", () => {
  visit("/t/internationalization-localization/280");
  click('#topic-title .fa-pencil');

  fillIn('#edit-title', 'emojis title :bike: :blonde_woman:t6:');

  click('#topic-title .submit-edit');

  andThen(() => {
    equal(find('.fancy-title').html().trim(), 'emojis title <img src=\"/images/emoji/emoji_one/bike.png?v=5\" title=\"bike\" alt=\"bike\" class=\"emoji\"> <img src=\"/images/emoji/emoji_one/blonde_woman/6.png?v=5\" title=\"blonde_woman:t6\" alt=\"blonde_woman:t6\" class=\"emoji\">', 'it displays the new title with emojis');
  });
});
