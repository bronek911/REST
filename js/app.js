$(function () {

    var actualPage = 1;
    var container = $('div.container');
    var noOfPages;
    var columnSorting = 'id';
    var orderSorting = 'desc';
    var savingMethod;

    // Pagination

    $.getJSON( "http://localhost:3000/posts", function( posts ) {

        noOfPages = Math.ceil(posts.length / 10);

        for(var i=1; i <= noOfPages; i++){
            var lastPage = $('#nextPage');

            if(i == actualPage){
                var newPage = $("<li class='active' id='page" + i + "'><a href='#' class='number'>"+ i +"</a></li>");
            } else {
                var newPage = $("<li id='page" + i + "'><a href='#' class='number'>"+ i +"</a></li>");
            }
            newPage.insertBefore(lastPage);
        }
    });

    function renderElement(data) {
        var newMovie = $("" +
            "<div class='panel panel-default' id='" + data.id + "'>" +
            "<div class='panel-body'>" +
            "<span class='navbar-left'><b>Title:</b><span class='panelTitle'>" + data.title + "</span></span>" +
            "<span class='navbar-right'>" +
            "<span class='glyphicon glyphicon-remove' data-id='" + data.id + "'></span>" +
            "<span class='glyphicon glyphicon-cog' data-id='" + data.id + "'></span>" +
            "</span>" +
            "</div>" +
            "</div>");

        container.prepend(newMovie);
    }

    function getPage(page, sort = 'id', order = 'desc') {
        var jsonGet = $.getJSON('http://localhost:3000/posts?_page=' + page + '&_sort=' + sort + '&_order=' + order, data => {
            data.forEach(element => {
                renderElement(element);
            });
        });
    };
    getPage(actualPage, columnSorting, orderSorting);



    // Change page by number

    var pagination = $('div.pagination');

    pagination.on('click', '.number', function(){

        $('#page' + actualPage).removeClass('active');
        actualPage = $(this).text();
        $('#page' + actualPage).addClass('active');

        $('.container').empty();
        getPage(actualPage, columnSorting, orderSorting);
    });

    // Prev and Next page

    pagination.find('#prevPage').children().on('click', function(){
        if(actualPage != 1){
            $('#page' + actualPage).removeClass('active');
            actualPage--;
            $('#page' + actualPage).addClass('active');
            $('.container').empty();
            getPage(actualPage, columnSorting, orderSorting);
        }
    });
    pagination.find('#nextPage').children().on('click', function(){
        if(actualPage != noOfPages){
            $('#page' + actualPage).removeClass('active');
            actualPage++;
            $('#page' + actualPage).addClass('active');
            $('.container').empty();
            getPage(actualPage, columnSorting, orderSorting);
        }
    });

    // Sorting

    $('#sortButton').on('click', function(){

        columnSorting = $('#selectColumn').val();
        orderSorting = $('#selectOrder').val();

        console.log(columnSorting + " " + orderSorting);

        $('.container').empty();
        getPage(actualPage, columnSorting, orderSorting);
    });


    /// Remove element

    container.on('click', '.glyphicon-remove', function () {

        var id = $(this).data('id');

        console.log($(this));

        var adress = "http://localhost:3000/posts/" + id;

        $.ajax({
            method: "DELETE",
            url: adress,
            dataType: 'json',
        }).done(function (response) {

        }).fail(function (error) {
            //Natomiast, jeżeli wystapi błąd, to zostanie uruchomiona ta funkcja, a w `error` otrzymamy info o błędzie
            console.log('Error!', error);
        });

        $('#' + id).remove();
    });

    /// Edit element

    container.on('click', '.glyphicon-cog', function () {

        var id = $(this).data('id');
        savingMethod = "edit";

        $('#myModal').modal('toggle');
        $('#myModal').data('id', id);
        $('#myModalLabel').text('Edit - ID: ' + id);

        $.getJSON('http://localhost:3000/posts/' + id, function (data) {
            $('#inputTitle').val(data.title);
            $('#inputContent').val(data.content);
        });
    });

    /// New element

        $('.header').on('click', '#openModalNew', function () {

            savingMethod = 'new';

            $('#myModal').modal('toggle');
            $('#myModalLabel').text('Create new');

            $('#inputTitle').val('');
            $('#inputContent').val('');
        });




        $('#saveModal').on('click', function () {

            if(savingMethod == 'new'){

                var newTitle = $('#inputTitle').val();
                var newContent = $('#inputContent').val();

                var newElement = {title: newTitle, content: newContent};

                $.post("http://localhost:3000/posts", newElement)
                    .done(function (data) {
                        $('#myModal').modal('hide');

                        renderElement(newElement);
                    });

            } else if (savingMethod == 'edit'){

                var editTitle = $('#inputTitle').val();
                var editContent = $('#inputContent').val();
                var editedElement = {title: editTitle, content: editContent};
                let id = $('#myModal').data('id');

                $.ajax({
                    method: "PUT",
                    url: "http://localhost:3000/posts/" + id,
                    data: editedElement
                }).done(function (msg) {
                    $('#myModal').modal('hide');

                    $('#' + id).find('.panelTitle').text(editTitle);
                });
            }


        });


});